import { Injectable, NotFoundException } from '@nestjs/common';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { Demand } from '../../entities/demand/demand.entity';

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
