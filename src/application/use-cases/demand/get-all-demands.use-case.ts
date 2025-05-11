import { Injectable } from '@nestjs/common';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { Demand } from '../../entities/demand/demand.entity';

@Injectable()
export class GetAllDemandsUseCase {
  constructor(private readonly demandRepository: DemandRepository) {}

  async execute(): Promise<Demand[]> {
    return this.demandRepository.findAll();
  }
}
