import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from '../../entities/item.entity';
import { ItemRepository } from '../../repositories/item.repository';

@Injectable()
export class GetItemByIdUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(id: number): Promise<Item> {
    const item = await this.itemRepository.findById(id);

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }
}
