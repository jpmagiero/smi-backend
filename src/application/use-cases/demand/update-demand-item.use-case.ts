import { Injectable, NotFoundException } from '@nestjs/common';
import { DemandItemRepository } from '../../repositories/demand/demand-item-repository';
import { DemandItem } from '../../entities/demand/demand-item.entity';

@Injectable()
export class UpdateDemandItemUseCase {
  constructor(private readonly demandItemRepository: DemandItemRepository) {}

  async execute(
    id: number,
    totalPlan?: number,
    totalProduced?: number,
  ): Promise<DemandItem> {
    if (totalPlan === undefined && totalProduced === undefined) {
      throw new Error('At least one quantity value must be provided');
    }

    const demandItem = await this.demandItemRepository.findById(id);
    if (!demandItem) {
      throw new NotFoundException(`Demand item with ID ${id} not found`);
    }

    const updatedDemandItem = await this.demandItemRepository.updateDemandItem(
      id,
      totalPlan,
      totalProduced,
    );

    if (!updatedDemandItem) {
      throw new Error(`Failed to update demand item with ID ${id}`);
    }

    return updatedDemandItem;
  }
}
