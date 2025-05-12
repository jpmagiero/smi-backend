import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DemandRepository } from '../../../repositories/demand/demand-repository';
import { Demand, DemandStatus } from '../../../entities/demand/demand.entity';
import { DemandItem } from '../../../entities/demand/demand-item.entity';
import { Item } from '../../../entities/item.entity';
import { calculateDemandStatus } from '../../../utils/demand-status.util';
import { PaginatedResult } from '../../../entities/demand/demand.interface';
import { Prisma } from '@prisma/client';

interface PrismaItemWithRelations {
  id: number;
  sku: string;
  description: string;
}

interface PrismaDemandItemWithRelations {
  id: number;
  demandId: number;
  itemId: number;
  totalPlan: number;
  totalProduced: number;
  item: PrismaItemWithRelations | null;
}

interface PrismaDemandWithRelations {
  id: number;
  startDate: Date;
  endDate: Date;
  status: string;
  items: PrismaDemandItemWithRelations[];
}

@Injectable()
export class PrismaDemandRepository extends DemandRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(demand: Demand): Promise<Demand> {
    const result = await this.prisma.$transaction(async (prisma) => {
      const createdDemand = await prisma.demand.create({
        data: {
          startDate: demand.startDate,
          endDate: demand.endDate,
          status: DemandStatus.PLANNING,
        },
      });

      if (demand.items && demand.items.length > 0) {
        for (const demandItem of demand.items) {
          await prisma.demandItem.create({
            data: {
              demandId: createdDemand.id,
              itemId: demandItem.itemId,
              totalPlan: demandItem.totalPlan,
              totalProduced: Number(demandItem.totalProduced || 0),
            },
          });
        }
      }

      return this.findById(createdDemand.id);
    });

    return result as Demand;
  }

  async findAll(cursor?: string, limit = 10): Promise<PaginatedResult<Demand>> {
    const findManyArgs: Prisma.DemandFindManyArgs = {
      take: limit + 1,
      orderBy: { id: 'asc' },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    };

    if (cursor) {
      findManyArgs.cursor = { id: parseInt(cursor) };
      findManyArgs.skip = 1;
    }

    const demands = (await this.prisma.demand.findMany(
      findManyArgs,
    )) as unknown as PrismaDemandWithRelations[];

    const hasNextPage = demands.length > limit;
    const data = hasNextPage ? demands.slice(0, limit) : demands;
    const nextCursor =
      hasNextPage && data.length > 0 ? String(data[data.length - 1].id) : null;
    const totalCount = await this.prisma.demand.count();

    const mappedData = data.map((demand) => this.mapToDemand(demand));

    return {
      data: mappedData,
      meta: {
        cursor: nextCursor,
        hasNextPage,
        totalCount,
      },
    };
  }

  async findById(id: number): Promise<Demand | null> {
    const demand = (await this.prisma.demand.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    })) as unknown as PrismaDemandWithRelations | null;

    if (!demand) return null;

    return this.mapToDemand(demand);
  }

  async findDemandItemsPaginated(
    demandId: number,
    cursor?: string,
    limit = 10,
  ): Promise<PaginatedResult<Demand>> {
    const demand = await this.prisma.demand.findUnique({
      where: { id: demandId },
    });

    if (!demand) {
      return {
        data: [],
        meta: {
          cursor: null,
          hasNextPage: false,
          totalCount: 0,
        },
      };
    }

    const findManyArgs: Prisma.DemandItemFindManyArgs = {
      where: { demandId },
      take: limit + 1,
      orderBy: { id: 'asc' },
      include: {
        item: true,
      },
    };

    if (cursor) {
      findManyArgs.cursor = { id: parseInt(cursor) };
      findManyArgs.skip = 1;
    }

    const demandItems = (await this.prisma.demandItem.findMany(
      findManyArgs,
    )) as unknown as PrismaDemandItemWithRelations[];

    const hasNextPage = demandItems.length > limit;
    const data = hasNextPage ? demandItems.slice(0, limit) : demandItems;
    const nextCursor =
      hasNextPage && data.length > 0 ? String(data[data.length - 1].id) : null;
    const totalCount = await this.prisma.demandItem.count({
      where: { demandId },
    });

    const items = data.map((item) => this.mapToDemandItem(item));

    const demandWithPaginatedItems = new Demand({
      id: demand.id,
      startDate: demand.startDate,
      endDate: demand.endDate,
      items,
    });

    return {
      data: [demandWithPaginatedItems],
      meta: {
        cursor: nextCursor,
        hasNextPage,
        totalCount,
      },
    };
  }

  async update(
    id: number,
    demandData: Partial<Demand>,
  ): Promise<Demand | null> {
    const existingDemand = await this.prisma.demand.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!existingDemand) return null;

    const result = await this.prisma.$transaction(async (prisma) => {
      const updatedDemand = await prisma.demand.update({
        where: { id },
        data: {
          startDate: demandData.startDate ?? existingDemand.startDate,
          endDate: demandData.endDate ?? existingDemand.endDate,
        },
        include: {
          items: {
            include: {
              item: true,
            },
          },
        },
      });

      if (demandData.items !== undefined) {
        await prisma.demandItem.deleteMany({
          where: { demandId: id },
        });

        if (demandData.items.length > 0) {
          for (const demandItem of demandData.items) {
            await prisma.demandItem.create({
              data: {
                demandId: id,
                itemId: demandItem.itemId,
                totalPlan: demandItem.totalPlan,
                totalProduced: Number(demandItem.totalProduced || 0),
              },
            });
          }
        }

        const totalPlan = demandData.items.reduce(
          (sum, item) => sum + (item.totalPlan || 0),
          0,
        );
        const totalProduced = demandData.items.reduce(
          (sum, item) => sum + (Number(item.totalProduced) || 0),
          0,
        );
        const newStatus = calculateDemandStatus(totalPlan, totalProduced);

        await prisma.demand.update({
          where: { id },
          data: {
            status: newStatus,
          },
        });

        return this.findById(id);
      }

      return this.mapToDemand(
        updatedDemand as unknown as PrismaDemandWithRelations,
      );
    });

    return result as Demand;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.demandItem.deleteMany({
          where: { demandId: id },
        });

        await prisma.demand.delete({
          where: { id },
        });
      });

      return true;
    } catch {
      return false;
    }
  }

  private mapToDemand(prismaDemand: PrismaDemandWithRelations): Demand {
    const items = prismaDemand.items.map((item) => this.mapToDemandItem(item));

    return new Demand({
      id: prismaDemand.id,
      startDate: prismaDemand.startDate,
      endDate: prismaDemand.endDate,
      items,
    });
  }

  private mapToDemandItem(
    prismaItem: PrismaDemandItemWithRelations,
  ): DemandItem {
    return new DemandItem({
      id: prismaItem.id,
      demandId: prismaItem.demandId,
      itemId: prismaItem.itemId,
      totalPlan: prismaItem.totalPlan,
      totalProduced: prismaItem.totalProduced,
      item: prismaItem.item ? this.mapToItem(prismaItem.item) : undefined,
    });
  }

  private mapToItem(prismaItem: PrismaItemWithRelations): Item {
    return new Item({
      id: prismaItem.id,
      sku: prismaItem.sku,
      description: prismaItem.description,
    });
  }
}
