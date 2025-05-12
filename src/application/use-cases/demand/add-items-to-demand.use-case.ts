import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Demand } from '../../entities/demand/demand.entity';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { ItemRepository } from '../../repositories/item.repository';
import { AddItemsToDemandDto } from '../../dtos/demand/add-items-to-demand.dto';
import { DemandItem } from '../../entities/demand/demand-item.entity';

@Injectable()
export class AddItemsToDemandUseCase {
  constructor(
    private readonly demandRepository: DemandRepository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(id: number, dto: AddItemsToDemandDto): Promise<Demand> {
    const existingDemand = await this.demandRepository.findById(id);
    if (!existingDemand) {
      throw new NotFoundException(`Demand with ID ${id} not found`);
    }

    const itemIds = dto.items.map((item) => item.itemId);
    const nonExistentItemIds: number[] = [];

    for (const itemId of itemIds) {
      const item = await this.itemRepository.findById(itemId);
      if (!item) {
        nonExistentItemIds.push(itemId);
      }
    }

    if (nonExistentItemIds.length > 0) {
      throw new BadRequestException(
        `It was not possible to add items to the demand. The following items do not exist: ${nonExistentItemIds.join(', ')}`,
      );
    }

    const existingItems = existingDemand.items || [];
    const existingItemIds = existingItems.map((item) => item.itemId);

    const duplicatedItems = dto.items.filter((item) =>
      existingItemIds.includes(item.itemId),
    );

    if (duplicatedItems.length > 0) {
      const duplicatedIds = duplicatedItems
        .map((item) => item.itemId)
        .join(', ');
      throw new ConflictException(
        `It is not possible to add duplicate items. The following items already exist in the demand: ${duplicatedIds}`,
      );
    }

    const newDemandItems = dto.items.map(
      (itemDto) =>
        new DemandItem({
          itemId: itemDto.itemId,
          totalPlan: itemDto.totalPlan,
          totalProduced: itemDto.totalProduced || 0,
          demandId: id,
        }),
    );

    const updatedItems = [...existingItems, ...newDemandItems];

    const updatedDemand = await this.demandRepository.update(id, {
      items: updatedItems,
    });

    if (!updatedDemand) {
      throw new NotFoundException(`Failed to update the demand with ID ${id}`);
    }

    return updatedDemand;
  }
}
