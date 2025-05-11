import { Item } from '../entities/item.entity';

export abstract class ItemRepository {
  abstract create(item: Item): Promise<Item>;
  abstract findByDemandId(demandId: number): Promise<Item[]>;
  abstract findBySku(sku: string): Promise<Item | null>;
  abstract findById(id: number): Promise<Item | null>;
  abstract update(id: number, item: Partial<Item>): Promise<Item | null>;
  abstract delete(id: number): Promise<boolean>;
  abstract deleteByDemandId(demandId: number): Promise<boolean>;
}
