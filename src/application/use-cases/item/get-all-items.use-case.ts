import { Injectable } from '@nestjs/common';
import { Item } from '../../entities/item.entity';
import { ItemRepository } from '../../repositories/item.repository';

@Injectable()
export class GetAllItemsUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  async execute(): Promise<Item[]> {
    return this.itemRepository.findAll();
  }
}
