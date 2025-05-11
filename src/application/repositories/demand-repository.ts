import { Demand } from '../entities/demand.entity';

export abstract class DemandRepository {
  abstract create(demand: Demand): Promise<Demand>;
  abstract findAll(): Promise<Demand[]>;
  abstract findById(id: number): Promise<Demand | null>;
  abstract update(id: number, demand: Partial<Demand>): Promise<Demand | null>;
  abstract delete(id: number): Promise<boolean>;
}
