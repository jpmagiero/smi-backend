import { Injectable, NotFoundException } from '@nestjs/common';
import { Demand } from '../entities/demand.entity';
import { DemandRepository } from '../repositories/demand-repository';

@Injectable()
export class GetDemandByIdUseCase {
  constructor(private readonly demandRepository: DemandRepository) {}

  async execute(id: number): Promise<Demand> {
    const demand = await this.demandRepository.findById(id);

    if (!demand) {
      throw new NotFoundException(`Demand with ID ${id} not found`);
    }

    return demand;
  }
}
