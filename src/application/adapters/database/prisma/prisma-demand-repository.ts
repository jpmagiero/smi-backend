import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DemandRepository } from '../../../repositories/demand/demand-repository';
import { Demand, DemandStatus } from '../../../entities/demand/demand.entity';
import { DemandItem } from '../../../entities/demand/demand-item.entity';
import { Item } from '../../../entities/item.entity';
import { calculateDemandStatus } from '../../../utils/demand-status.util';

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

      const demandWithItems = await prisma.demand.findUnique({
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
        throw new Error(
          `Failed to retrieve demand with ID ${createdDemand.id}`,
        );
      }

      const items = demandWithItems.items.map(
        (item) =>
          new DemandItem({
            id: item.id,
            demandId: item.demandId,
            itemId: item.itemId,
            totalPlan: item.totalPlan,
            totalProduced: Number(item.totalProduced || 0),
            item: item.item
              ? new Item({
                  id: item.item.id,
                  sku: item.item.sku,
                  description: item.item.description,
                })
              : undefined,
          }),
      );

      return new Demand({
        id: demandWithItems.id,
        startDate: demandWithItems.startDate,
        endDate: demandWithItems.endDate,
        items,
      });
    });

    return result;
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

    return demands.map((demand) => {
      const items = demand.items.map(
        (item) =>
          new DemandItem({
            id: item.id,
            demandId: item.demandId,
            itemId: item.itemId,
            totalPlan: item.totalPlan,
            totalProduced: Number(item.totalProduced || 0),
            item: item.item
              ? new Item({
                  id: item.item.id,
                  sku: item.item.sku,
                  description: item.item.description,
                })
              : undefined,
          }),
      );

      return new Demand({
        id: demand.id,
        startDate: demand.startDate,
        endDate: demand.endDate,
        items,
      });
    });
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

    const items = demand.items.map(
      (item) =>
        new DemandItem({
          id: item.id,
          demandId: item.demandId,
          itemId: item.itemId,
          totalPlan: item.totalPlan,
          totalProduced: Number(item.totalProduced || 0),
          item: item.item
            ? new Item({
                id: item.item.id,
                sku: item.item.sku,
                description: item.item.description,
              })
            : undefined,
        }),
    );

    return new Demand({
      id: demand.id,
      startDate: demand.startDate,
      endDate: demand.endDate,
      items,
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

    const result = await this.prisma.$transaction(async (prisma) => {
      // Atualizar apenas os campos startDate e endDate
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

        const updatedWithItems = await prisma.demand.findUnique({
          where: { id },
          include: {
            items: {
              include: {
                item: true,
              },
            },
          },
        });

        if (!updatedWithItems) {
          throw new Error(`Failed to retrieve updated demand with ID ${id}`);
        }

        const items = updatedWithItems.items.map(
          (item) =>
            new DemandItem({
              id: item.id,
              demandId: item.demandId,
              itemId: item.itemId,
              totalPlan: item.totalPlan,
              totalProduced: Number(item.totalProduced || 0),
              item: item.item
                ? new Item({
                    id: item.item.id,
                    sku: item.item.sku,
                    description: item.item.description,
                  })
                : undefined,
            }),
        );

        return new Demand({
          id: updatedWithItems.id,
          startDate: updatedWithItems.startDate,
          endDate: updatedWithItems.endDate,
          items,
        });
      }

      const items = updatedDemand.items.map(
        (item) =>
          new DemandItem({
            id: item.id,
            demandId: item.demandId,
            itemId: item.itemId,
            totalPlan: item.totalPlan,
            totalProduced: Number(item.totalProduced || 0),
            item: item.item
              ? new Item({
                  id: item.item.id,
                  sku: item.item.sku,
                  description: item.item.description,
                })
              : undefined,
          }),
      );

      return new Demand({
        id: updatedDemand.id,
        startDate: updatedDemand.startDate,
        endDate: updatedDemand.endDate,
        items,
      });
    });

    return result;
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
}
