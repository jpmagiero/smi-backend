import { DemandItem } from '../../entities/demand/demand-item.entity';

export abstract class DemandItemRepository {
  abstract create(demandItem: DemandItem): Promise<DemandItem>;
  abstract findByDemandId(demandId: number): Promise<DemandItem[]>;
  abstract findByItemId(itemId: number): Promise<DemandItem[]>;
  abstract findById(id: number): Promise<DemandItem | null>;
  abstract update(
    id: number,
    demandItem: Partial<DemandItem>,
  ): Promise<DemandItem | null>;
  abstract updateDemandItem(
    id: number,
    totalPlan?: number,
    totalProduced?: number,
  ): Promise<DemandItem | null>;
  abstract delete(id: number): Promise<boolean>;
  abstract deleteByDemandId(demandId: number): Promise<boolean>;
}
