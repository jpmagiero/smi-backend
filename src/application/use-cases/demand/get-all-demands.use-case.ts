import { Injectable } from '@nestjs/common';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { Demand } from '../../entities/demand/demand.entity';

interface DemandWithSummary extends Demand {
  totalPlan: number;
  totalProd: number;
}

@Injectable()
export class GetAllDemandsUseCase {
  constructor(private readonly demandRepository: DemandRepository) {}

  async execute(): Promise<DemandWithSummary[]> {
    const demands = await this.demandRepository.findAll();

    return demands as DemandWithSummary[];
  }
}
