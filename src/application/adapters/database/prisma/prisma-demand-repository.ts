import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DemandRepository } from '../../../repositories/demand-repository';
import { Demand, DemandStatus } from '../../../entities/demand.entity';
import { DemandItem } from '../../../entities/demand-item.entity';

@Injectable()
export class PrismaDemandRepository extends DemandRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(demand: Demand): Promise<Demand> {
    const { items, ...demandData } = demand;

    const createdDemand = await this.prisma.demand.create({
      data: {
        startDate: demandData.startDate,
        endDate: demandData.endDate,
        status: demandData.status,
        itens: {
          create: items.map((item) => ({
            sku: item.sku,
            totalPlan: item.totalPlan,
          })),
        },
      },
      include: {
        itens: true,
      },
    });

    return new Demand({
      startDate: createdDemand.startDate,
      endDate: createdDemand.endDate,
      status: createdDemand.status as DemandStatus,
      items: createdDemand.itens.map(
        (item) =>
          new DemandItem({
            sku: item.sku,
            totalPlan: item.totalPlan,
            demandId: item.demandId,
          }),
      ),
    });
  }

  async findAll(): Promise<Demand[]> {
    const demands = await this.prisma.demand.findMany({
      include: {
        itens: true,
      },
    });

    return demands.map(
      (demand) =>
        new Demand({
          startDate: demand.startDate,
          endDate: demand.endDate,
          status: demand.status as DemandStatus,
          items: demand.itens.map(
            (item) =>
              new DemandItem({
                sku: item.sku,
                totalPlan: item.totalPlan,
                demandId: item.demandId,
              }),
          ),
        }),
    );
  }

  async findById(id: number): Promise<Demand | null> {
    const demand = await this.prisma.demand.findUnique({
      where: { id },
      include: {
        itens: true,
      },
    });

    if (!demand) return null;

    return new Demand({
      startDate: demand.startDate,
      endDate: demand.endDate,
      status: demand.status as DemandStatus,
      items: demand.itens.map(
        (item) =>
          new DemandItem({
            sku: item.sku,
            totalPlan: item.totalPlan,
            demandId: item.demandId,
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
      include: { itens: true },
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
        itens: true,
      },
    });

    return new Demand({
      startDate: updatedDemand.startDate,
      endDate: updatedDemand.endDate,
      status: updatedDemand.status as DemandStatus,
      items: updatedDemand.itens.map(
        (item) =>
          new DemandItem({
            sku: item.sku,
            totalPlan: item.totalPlan,
            demandId: item.demandId,
          }),
      ),
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.demandItem.deleteMany({
        where: { demandId: id },
      });
      await this.prisma.demand.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }
}
