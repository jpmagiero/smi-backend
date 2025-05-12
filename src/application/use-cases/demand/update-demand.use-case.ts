import { Injectable, NotFoundException } from '@nestjs/common';
import { Demand } from '../../entities/demand/demand.entity';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { UpdateDemandDto } from '../../dtos/demand/update-demand.dto';

@Injectable()
export class UpdateDemandUseCase {
  constructor(private readonly demandRepository: DemandRepository) {}

  async execute(id: number, updateDemandDto: UpdateDemandDto): Promise<Demand> {
    const existingDemand = await this.demandRepository.findById(id);

    if (!existingDemand) {
      throw new NotFoundException(`Demand with ID ${id} not found`);
    }

    const updateData: Partial<Demand> = {
      startDate: updateDemandDto.startDate,
      endDate: updateDemandDto.endDate,
    };

    const updatedDemand = await this.demandRepository.update(id, updateData);

    if (!updatedDemand) {
      throw new NotFoundException(`Failed to update demand with ID ${id}`);
    }

    return updatedDemand;
  }
}
