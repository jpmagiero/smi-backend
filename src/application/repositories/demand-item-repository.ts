import { DemandItem } from '../entities/demand-item.entity';

export abstract class DemandItemRepository {
  abstract create(demandItem: DemandItem): Promise<DemandItem>;
  abstract findByDemandId(demandId: number): Promise<DemandItem[]>;
  abstract update(
    id: number,
    demandItem: Partial<DemandItem>,
  ): Promise<DemandItem | null>;
  abstract delete(id: number): Promise<boolean>;
}
