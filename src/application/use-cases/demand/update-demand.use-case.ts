import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Demand } from '../../entities/demand/demand.entity';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { ItemRepository } from '../../repositories/item.repository';
import { UpdateDemandDto } from '../../dtos/demand/update-demand.dto';
import { DemandItem } from '../../entities/demand/demand-item.entity';

@Injectable()
export class UpdateDemandUseCase {
  constructor(
    private readonly demandRepository: DemandRepository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(id: number, updateDemandDto: UpdateDemandDto): Promise<Demand> {
    const existingDemand = await this.demandRepository.findById(id);

    if (!existingDemand) {
      throw new NotFoundException(`Demand with ID ${id} not found`);
    }

    const updateData: Partial<Demand> = {
      startDate: updateDemandDto.startDate,
      endDate: updateDemandDto.endDate,
      status: updateDemandDto.status,
    };

    if (updateDemandDto.items && updateDemandDto.items.length > 0) {
      const itemIds = updateDemandDto.items
        .map((item) => item.itemId)
        .filter((itemId) => itemId !== undefined);

      if (itemIds.length > 0) {
        const nonExistentItemIds: number[] = [];

        for (const itemId of itemIds) {
          const item = await this.itemRepository.findById(itemId);
          if (!item) {
            nonExistentItemIds.push(itemId);
          }
        }

        if (nonExistentItemIds.length > 0) {
          throw new BadRequestException(
            `Não foi possível atualizar a demanda. Os seguintes itens não existem: ${nonExistentItemIds.join(
              ', ',
            )}`,
          );
        }
      }

      updateData.items = updateDemandDto.items.map((itemDto) => {
        if (itemDto.itemId === undefined || itemDto.totalPlan === undefined) {
          throw new Error(
            'Item ID and totalPlan are required for item updates',
          );
        }

        return new DemandItem({
          id: itemDto.id,
          itemId: itemDto.itemId,
          totalPlan: itemDto.totalPlan,
          demandId: id,
        });
      });
    } else if (updateDemandDto.items !== undefined) {
      updateData.items = [];
    }

    const updatedDemand = await this.demandRepository.update(id, updateData);

    if (!updatedDemand) {
      throw new NotFoundException(`Failed to update demand with ID ${id}`);
    }

    return updatedDemand;
  }
}
