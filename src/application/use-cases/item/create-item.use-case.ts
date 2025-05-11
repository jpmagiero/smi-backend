import { Injectable, ConflictException } from '@nestjs/common';
import { Item } from '../../entities/item.entity';
import { ItemRepository } from '../../repositories/item.repository';
import { CreateItemDto } from '../../dtos/item/create-item.dto';

@Injectable()
export class CreateItemUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(createItemDto: CreateItemDto): Promise<Item> {
    const existingItem = await this.itemRepository.findBySku(createItemDto.sku);

    if (existingItem) {
      throw new ConflictException(
        `Item with SKU ${createItemDto.sku} already exists`,
      );
    }

    const item = new Item({
      sku: createItemDto.sku,
      description: createItemDto.description,
    });

    return this.itemRepository.create(item);
  }
}
