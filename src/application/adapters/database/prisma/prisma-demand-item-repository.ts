import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DemandItemRepository } from '../../../repositories/demand/demand-item-repository';
import { DemandItem } from '../../../entities/demand/demand-item.entity';
import { Item } from '../../../entities/item.entity';

@Injectable()
export class PrismaDemandItemRepository extends DemandItemRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(demandItem: DemandItem): Promise<DemandItem> {
    const created = await this.prisma.demandItem.create({
      data: {
        demandId: demandItem.demandId,
        itemId: demandItem.itemId,
        totalPlan: demandItem.totalPlan,
      },
      include: {
        item: true,
      },
    });

    return new DemandItem({
      id: created.id,
      demandId: created.demandId,
      itemId: created.itemId,
      totalPlan: created.totalPlan,
      item: created.item
        ? new Item({
            id: created.item.id,
            sku: created.item.sku,
            description: created.item.description,
          })
        : undefined,
    });
  }

  async findByDemandId(demandId: number): Promise<DemandItem[]> {
    const items = await this.prisma.demandItem.findMany({
      where: { demandId },
      include: {
        item: true,
      },
    });

    return items.map(
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
    );
  }

  async findByItemId(itemId: number): Promise<DemandItem[]> {
    const items = await this.prisma.demandItem.findMany({
      where: { itemId },
      include: {
        item: true,
      },
    });

    return items.map(
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
    );
  }

  async findById(id: number): Promise<DemandItem | null> {
    const demandItem = await this.prisma.demandItem.findUnique({
      where: { id },
      include: {
        item: true,
      },
    });

    if (!demandItem) return null;

    return new DemandItem({
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
    });
  }

  async update(
    id: number,
    demandItemData: Partial<DemandItem>,
  ): Promise<DemandItem | null> {
    try {
      const updated = await this.prisma.demandItem.update({
        where: { id },
        data: {
          itemId: demandItemData.itemId,
          totalPlan: demandItemData.totalPlan,
        },
        include: {
          item: true,
        },
      });

      return new DemandItem({
        id: updated.id,
        demandId: updated.demandId,
        itemId: updated.itemId,
        totalPlan: updated.totalPlan,
        item: updated.item
          ? new Item({
              id: updated.item.id,
              sku: updated.item.sku,
              description: updated.item.description,
            })
          : undefined,
      });
    } catch {
      return null;
    }
  }

  async updateDemandItem(
    id: number,
    totalPlan?: number,
    totalProduced?: number,
  ): Promise<DemandItem | null> {
    try {
      const data: { totalPlan?: number; totalProduced?: number } = {};

      if (totalPlan !== undefined) {
        data.totalPlan = totalPlan;
      }

      if (totalProduced !== undefined) {
        data.totalProduced = Number(totalProduced || 0);
      }

      if (Object.keys(data).length === 0) {
        throw new Error('No quantities provided for update');
      }

      const updated = await this.prisma.demandItem.update({
        where: { id },
        data,
        include: {
          item: true,
        },
      });

      return new DemandItem({
        id: updated.id,
        demandId: updated.demandId,
        itemId: updated.itemId,
        totalPlan: updated.totalPlan,
        totalProduced: Number(updated.totalProduced || 0),
        item: updated.item
          ? new Item({
              id: updated.item.id,
              sku: updated.item.sku,
              description: updated.item.description,
            })
          : undefined,
      });
    } catch (error) {
      console.error('Error updating demand item quantities:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.demandItem.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteByDemandId(demandId: number): Promise<boolean> {
    try {
      await this.prisma.demandItem.deleteMany({
        where: { demandId },
      });
      return true;
    } catch {
      return false;
    }
  }
}
