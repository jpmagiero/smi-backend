import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Item } from '../../entities/item.entity';
import { ItemRepository } from '../../repositories/item.repository';
import { UpdateItemDto } from '../../dtos/item/update-item.dto';

@Injectable()
export class UpdateItemUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const existingItem = await this.itemRepository.findById(id);

    if (!existingItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    if (updateItemDto.sku && updateItemDto.sku !== existingItem.sku) {
      const itemWithSku = await this.itemRepository.findBySku(
        updateItemDto.sku,
      );
      if (itemWithSku && itemWithSku.id !== id) {
        throw new ConflictException(
          `Item with SKU ${updateItemDto.sku} already exists`,
        );
      }
    }

    const updateData: Partial<Item> = {
      sku: updateItemDto.sku,
      description: updateItemDto.description,
    };

    const updatedItem = await this.itemRepository.update(id, updateData);

    if (!updatedItem) {
      throw new NotFoundException(`Failed to update item with ID ${id}`);
    }

    return updatedItem;
  }
}
