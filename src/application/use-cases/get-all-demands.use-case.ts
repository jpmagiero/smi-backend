import { Injectable } from '@nestjs/common';
import { Demand } from '../entities/demand.entity';
import { DemandRepository } from '../repositories/demand-repository';

@Injectable()
export class GetAllDemandsUseCase {
  constructor(private readonly demandRepository: DemandRepository) {}

  async execute(): Promise<Demand[]> {
    return this.demandRepository.findAll();
  }
}
