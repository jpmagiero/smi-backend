import { Injectable, NotFoundException } from '@nestjs/common';
import { Demand } from '../../entities/demand/demand.entity';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { UpdateDemandDto } from '../../dtos/demand/update-demand.dto';
import { DemandItem } from '../../entities/demand/demand-item.entity';

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
      status: updateDemandDto.status,
    };

    if (updateDemandDto.items && updateDemandDto.items.length > 0) {
      updateData.items = updateDemandDto.items.map((itemDto) => {
        if (itemDto.itemId === undefined || itemDto.totalPlan === undefined) {
          throw new Error(
            'Item ID and totalPlan are required for item updates',
          );
        }

        return new DemandItem({
          id: itemDto.id,
          itemId: itemDto.itemId,
          totalPlan: itemDto.totalPlan,
          demandId: id,
        });
      });
    }

    const updatedDemand = await this.demandRepository.update(id, updateData);

    if (!updatedDemand) {
      throw new NotFoundException(`Failed to update demand with ID ${id}`);
    }

    return updatedDemand;
  }
}
