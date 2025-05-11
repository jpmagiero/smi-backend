import { Injectable, NotFoundException } from '@nestjs/common';
import { Demand } from '../entities/demand.entity';
import { DemandRepository } from '../repositories/demand-repository';
import { UpdateDemandDto } from '../dtos/update-demand.dto';

@Injectable()
export class UpdateDemandUseCase {
  constructor(private readonly demandRepository: DemandRepository) {}

  async execute(id: number, updateDemandDto: UpdateDemandDto): Promise<Demand> {
    const existingDemand = await this.demandRepository.findById(id);

    if (!existingDemand) {
      throw new NotFoundException(`Demand with ID ${id} not found`);
    }

    const updatedDemand = await this.demandRepository.update(id, {
      startDate: updateDemandDto.startDate,
      endDate: updateDemandDto.endDate,
      status: updateDemandDto.status,
    });

    if (!updatedDemand) {
      throw new NotFoundException(`Failed to update demand with ID ${id}`);
    }

    return updatedDemand;
  }
}
