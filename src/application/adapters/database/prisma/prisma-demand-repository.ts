import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DemandRepository } from '../../../repositories/demand/demand-repository';
import { Demand, DemandStatus } from '../../../entities/demand/demand.entity';
import { DemandItem } from '../../../entities/demand/demand-item.entity';
import { Item } from '../../../entities/item.entity';

@Injectable()
export class PrismaDemandRepository extends DemandRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(demand: Demand): Promise<Demand> {
    const createdDemand = await this.prisma.demand.create({
      data: {
        startDate: demand.startDate,
        endDate: demand.endDate,
        status: demand.status,
      },
    });

    if (demand.items && demand.items.length > 0) {
      for (const demandItem of demand.items) {
        await this.prisma.demandItem.create({
          data: {
            demandId: createdDemand.id,
            itemId: demandItem.itemId,
            totalPlan: demandItem.totalPlan,
          },
        });
      }
    }

    const demandWithItems = await this.prisma.demand.findUnique({
      where: { id: createdDemand.id },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!demandWithItems) {
      throw new Error(`Failed to retrieve demand with ID ${createdDemand.id}`);
    }

    return new Demand({
      id: demandWithItems.id,
      startDate: demandWithItems.startDate,
      endDate: demandWithItems.endDate,
      status: demandWithItems.status as DemandStatus,
      items: demandWithItems.items.map(
        (demandItem) =>
          new DemandItem({
            id: demandItem.id,
            demandId: demandItem.demandId,
            itemId: demandItem.itemId,
            totalPlan: demandItem.totalPlan,
            item: demandItem.item
              ? new Item({
                  id: demandItem.item.id,
                  sku: demandItem.item.sku,
                  description: demandItem.item.description,
                })
              : undefined,
          }),
      ),
    });
  }

  async findAll(): Promise<Demand[]> {
    const demands = await this.prisma.demand.findMany({
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    return demands.map(
      (demand) =>
        new Demand({
          id: demand.id,
          startDate: demand.startDate,
          endDate: demand.endDate,
          status: demand.status as DemandStatus,
          items: demand.items.map(
            (demandItem) =>
              new DemandItem({
                id: demandItem.id,
                demandId: demandItem.demandId,
                itemId: demandItem.itemId,
                totalPlan: demandItem.totalPlan,
                item: demandItem.item
                  ? new Item({
                      id: demandItem.item.id,
                      sku: demandItem.item.sku,
                      description: demandItem.item.description,
                    })
                  : undefined,
              }),
          ),
        }),
    );
  }

  async findById(id: number): Promise<Demand | null> {
    const demand = await this.prisma.demand.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!demand) return null;

    return new Demand({
      id: demand.id,
      startDate: demand.startDate,
      endDate: demand.endDate,
      status: demand.status as DemandStatus,
      items: demand.items.map(
        (demandItem) =>
          new DemandItem({
            id: demandItem.id,
            demandId: demandItem.demandId,
            itemId: demandItem.itemId,
            totalPlan: demandItem.totalPlan,
            item: demandItem.item
              ? new Item({
                  id: demandItem.item.id,
                  sku: demandItem.item.sku,
                  description: demandItem.item.description,
                })
              : undefined,
          }),
      ),
    });
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

    const updatedDemand = await this.prisma.demand.update({
      where: { id },
      data: {
        startDate: demandData.startDate ?? existingDemand.startDate,
        endDate: demandData.endDate ?? existingDemand.endDate,
        status: demandData.status ?? existingDemand.status,
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (demandData.items && demandData.items.length > 0) {
      await this.prisma.demandItem.deleteMany({
        where: { demandId: id },
      });

      for (const demandItem of demandData.items) {
        await this.prisma.demandItem.create({
          data: {
            demandId: id,
            itemId: demandItem.itemId,
            totalPlan: demandItem.totalPlan,
          },
        });
      }

      const demandWithUpdatedItems = await this.prisma.demand.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              item: true,
            },
          },
        },
      });

      if (!demandWithUpdatedItems) {
        throw new Error(`Failed to retrieve updated demand with ID ${id}`);
      }

      return new Demand({
        id: demandWithUpdatedItems.id,
        startDate: demandWithUpdatedItems.startDate,
        endDate: demandWithUpdatedItems.endDate,
        status: demandWithUpdatedItems.status as DemandStatus,
        items: demandWithUpdatedItems.items.map(
          (demandItem) =>
            new DemandItem({
              id: demandItem.id,
              demandId: demandItem.demandId,
              itemId: demandItem.itemId,
              totalPlan: demandItem.totalPlan,
              item: demandItem.item
                ? new Item({
                    id: demandItem.item.id,
                    sku: demandItem.item.sku,
                    description: demandItem.item.description,
                  })
                : undefined,
            }),
        ),
      });
    }

    return new Demand({
      id: updatedDemand.id,
      startDate: updatedDemand.startDate,
      endDate: updatedDemand.endDate,
      status: updatedDemand.status as DemandStatus,
      items: updatedDemand.items.map(
        (demandItem) =>
          new DemandItem({
            id: demandItem.id,
            demandId: demandItem.demandId,
            itemId: demandItem.itemId,
            totalPlan: demandItem.totalPlan,
            item: demandItem.item
              ? new Item({
                  id: demandItem.item.id,
                  sku: demandItem.item.sku,
                  description: demandItem.item.description,
                })
              : undefined,
          }),
      ),
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.demand.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }
}
