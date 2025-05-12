import { Injectable } from '@nestjs/common';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { calculateDemandStatus } from '../../utils/demand-status.util';
import { DemandSummary } from '../../entities/demand/demand.interface';

@Injectable()
export class GetAllDemandsUseCase {
  constructor(private readonly demandRepository: DemandRepository) {}

  async execute(): Promise<DemandSummary[]> {
    const demands = await this.demandRepository.findAll();

    return demands.map((demand) => {
      const totalPlan = demand.totalPlan;
      const totalProd = demand.totalProd;

      return {
        id: demand.id!,
        startDate: demand.startDate,
        endDate: demand.endDate,
        totalPlan,
        totalProd,
        status: calculateDemandStatus(totalPlan, totalProd),
      };
    });
  }
}
