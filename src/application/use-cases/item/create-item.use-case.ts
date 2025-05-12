import { Injectable, ConflictException } from '@nestjs/common';
import { Item } from '../../entities/item.entity';
import { ItemRepository } from '../../repositories/item.repository';
import { CreateItemDto } from '../../dtos/item/create-item.dto';

@Injectable()
export class CreateItemUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(
    createItemDto: CreateItemDto | CreateItemDto[],
  ): Promise<Item | Item[]> {
    if (Array.isArray(createItemDto)) {
      const skus = createItemDto.map((item) => item.sku);
      const uniqueSkus = new Set(skus);
      if (uniqueSkus.size !== skus.length) {
        throw new ConflictException('Request contains duplicate SKUs');
      }

      for (const item of createItemDto) {
        const existingItem = await this.itemRepository.findBySku(item.sku);
        if (existingItem) {
          throw new ConflictException(
            `Item with SKU ${item.sku} already exists`,
          );
        }
      }

      const items = createItemDto.map(
        (itemDto) =>
          new Item({
            sku: itemDto.sku,
            description: itemDto.description,
          }),
      );

      return this.itemRepository.createMany(items);
    } else {
      const existingItem = await this.itemRepository.findBySku(
        createItemDto.sku,
      );

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
}
