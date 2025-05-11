import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from '../../repositories/item.repository';

@Injectable()
export class DeleteItemUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(id: number): Promise<void> {
    const item = await this.itemRepository.findById(id);

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    const deleted = await this.itemRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Failed to delete item with ID ${id}`);
    }
  }
}
