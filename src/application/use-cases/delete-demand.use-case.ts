import { Injectable, NotFoundException } from '@nestjs/common';
import { DemandRepository } from '../repositories/demand-repository';

@Injectable()
export class DeleteDemandUseCase {
  constructor(private readonly demandRepository: DemandRepository) {}

  async execute(id: number): Promise<void> {
    const demand = await this.demandRepository.findById(id);

    if (!demand) {
      throw new NotFoundException(`Demand with ID ${id} not found`);
    }

    const deleted = await this.demandRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Failed to delete demand with ID ${id}`);
    }
  }
}
