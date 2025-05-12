import { Injectable, NotFoundException } from '@nestjs/common';
import { Demand } from '../../entities/demand/demand.entity';
import { DemandRepository } from '../../repositories/demand/demand-repository';

@Injectable()
export class RemoveItemFromDemandUseCase {
  constructor(private readonly demandRepository: DemandRepository) {}

  async execute(demandId: number, itemId: number): Promise<Demand> {
    const existingDemand = await this.demandRepository.findById(demandId);
    if (!existingDemand) {
      throw new NotFoundException(`Demand with ID ${demandId} not found`);
    }

    const existingItems = existingDemand.items || [];
    const itemExists = existingItems.some((item) => item.itemId === itemId);

    if (!itemExists) {
      throw new NotFoundException(
        `Item with ID ${itemId} not found in demand ${demandId}`,
      );
    }

    const updatedItems = existingItems.filter((item) => item.itemId !== itemId);

    const updatedDemand = await this.demandRepository.update(demandId, {
      items: updatedItems,
    });

    if (!updatedDemand) {
      throw new NotFoundException(
        `Failed to update the demand with ID ${demandId}`,
      );
    }

    return updatedDemand;
  }
}
