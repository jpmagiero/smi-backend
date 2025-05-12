import { Demand } from '../../entities/demand/demand.entity';
import { PaginatedResult } from '../../entities/demand/demand.interface';

export abstract class DemandRepository {
  abstract create(demand: Demand): Promise<Demand>;
  abstract findAll(
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResult<Demand>>;
  abstract findById(id: number): Promise<Demand | null>;
  abstract findDemandItemsPaginated(
    demandId: number,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResult<Demand>>;
  abstract update(id: number, demand: Partial<Demand>): Promise<Demand | null>;
  abstract delete(id: number): Promise<boolean>;
}
