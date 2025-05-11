import { Injectable } from '@nestjs/common';
import { Demand } from '../../entities/demand/demand.entity';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { CreateDemandDto } from '../../dtos/demand/create-demand.dto';
import { DemandItem } from '../../entities/demand/demand-item.entity';

@Injectable()
export class CreateDemandUseCase {
  constructor(private readonly demandRepository: DemandRepository) {}

  async execute(createDemandDto: CreateDemandDto): Promise<Demand> {
    const demand = new Demand({
      startDate: createDemandDto.startDate,
      endDate: createDemandDto.endDate,
      status: createDemandDto.status,
      items: createDemandDto.items.map(
        (itemDto) =>
          new DemandItem({
            itemId: itemDto.itemId,
            totalPlan: itemDto.totalPlan,
            demandId: 0,
          }),
      ),
    });

    return this.demandRepository.create(demand);
  }
}
