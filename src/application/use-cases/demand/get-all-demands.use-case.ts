import { Injectable } from '@nestjs/common';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { calculateDemandStatus } from '../../utils/demand-status.util';
import {
  DemandSummary,
  PaginatedResult,
} from '../../entities/demand/demand.interface';

@Injectable()
export class GetAllDemandsUseCase {
  constructor(private readonly demandRepository: DemandRepository) {}

  async execute(
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResult<DemandSummary>> {
    const result = await this.demandRepository.findAll(cursor, limit);

    const data = result.data.map((demand) => {
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

    return {
      data,
      meta: result.meta,
    };
  }
}
