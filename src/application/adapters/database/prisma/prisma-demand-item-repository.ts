import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DemandItemRepository } from '../../../repositories/demand-item-repository';
import { DemandItem } from '../../../entities/demand-item.entity';

@Injectable()
export class PrismaDemandItemRepository extends DemandItemRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(demandItem: DemandItem): Promise<DemandItem> {
    const createdItem = await this.prisma.demandItem.create({
      data: {
        sku: demandItem.sku,
        totalPlan: demandItem.totalPlan,
        demandId: demandItem.demandId,
      },
    });

    return new DemandItem({
      sku: createdItem.sku,
      totalPlan: createdItem.totalPlan,
      demandId: createdItem.demandId,
    });
  }

  async findByDemandId(demandId: number): Promise<DemandItem[]> {
    const items = await this.prisma.demandItem.findMany({
      where: { demandId },
    });

    return items.map(
      (item) =>
        new DemandItem({
          sku: item.sku,
          totalPlan: item.totalPlan,
          demandId: item.demandId,
        }),
    );
  }

  async update(
    id: number,
    demandItem: Partial<DemandItem>,
  ): Promise<DemandItem | null> {
    try {
      const updatedItem = await this.prisma.demandItem.update({
        where: { id },
        data: {
          sku: demandItem.sku,
          totalPlan: demandItem.totalPlan,
        },
      });

      return new DemandItem({
        sku: updatedItem.sku,
        totalPlan: updatedItem.totalPlan,
        demandId: updatedItem.demandId,
      });
    } catch {
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
}
