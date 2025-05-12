import { Injectable, NotFoundException } from '@nestjs/common';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { Demand } from '../../entities/demand/demand.entity';
import { PaginatedResult } from '../../entities/demand/demand.interface';

@Injectable()
export class GetDemandByIdUseCase {
  constructor(private readonly demandRepository: DemandRepository) {}

  async execute(id: number): Promise<Demand> {
    const demand = await this.demandRepository.findById(id);

    if (!demand) {
      throw new NotFoundException(`Demand with ID ${id} not found`);
    }

    return demand;
  }

  async executeWithPaginatedItems(
    id: number,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResult<Demand>> {
    const result = await this.demandRepository.findDemandItemsPaginated(
      id,
      cursor,
      limit,
    );

    if (result.data.length === 0) {
      throw new NotFoundException(`Demand with ID ${id} not found`);
    }

    return result;
  }
}
