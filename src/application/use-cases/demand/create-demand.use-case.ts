import { Injectable, BadRequestException } from '@nestjs/common';
import { Demand } from '../../entities/demand/demand.entity';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { ItemRepository } from '../../repositories/item.repository';
import { CreateDemandDto } from '../../dtos/demand/create-demand.dto';
import { DemandItem } from '../../entities/demand/demand-item.entity';

@Injectable()
export class CreateDemandUseCase {
  constructor(
    private readonly demandRepository: DemandRepository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(createDemandDto: CreateDemandDto): Promise<Demand> {
    if (createDemandDto.items && createDemandDto.items.length > 0) {
      const itemIds = createDemandDto.items.map((item) => item.itemId);
      const nonExistentItemIds: number[] = [];

      for (const itemId of itemIds) {
        const item = await this.itemRepository.findById(itemId);
        if (!item) {
          nonExistentItemIds.push(itemId);
        }
      }

      if (nonExistentItemIds.length > 0) {
        throw new BadRequestException(
          `It was not possible to create the demand. The following items do not exist: ${nonExistentItemIds.join(', ')}`,
        );
      }
    }

    const demand = new Demand({
      startDate: createDemandDto.startDate,
      endDate: createDemandDto.endDate,
      items: createDemandDto.items
        ? createDemandDto.items.map(
            (itemDto) =>
              new DemandItem({
                itemId: itemDto.itemId,
                totalPlan: itemDto.totalPlan,
                totalProduced: itemDto.totalProduced || 0,
                demandId: 0,
              }),
          )
        : [],
    });

    return this.demandRepository.create(demand);
  }
}
