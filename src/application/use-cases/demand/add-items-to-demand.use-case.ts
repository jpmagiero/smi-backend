import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Demand } from '../../entities/demand/demand.entity';
import { DemandRepository } from '../../repositories/demand/demand-repository';
import { ItemRepository } from '../../repositories/item.repository';
import { AddItemsToDemandDto } from '../../dtos/demand/add-items-to-demand.dto';
import { DemandItem } from '../../entities/demand/demand-item.entity';

@Injectable()
export class AddItemsToDemandUseCase {
  constructor(
    private readonly demandRepository: DemandRepository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(id: number, dto: AddItemsToDemandDto): Promise<Demand> {
    const existingDemand = await this.demandRepository.findById(id);
    if (!existingDemand) {
      throw new NotFoundException(`Demanda com ID ${id} não encontrada`);
    }

    const itemIds = dto.items.map((item) => item.itemId);
    const nonExistentItemIds: number[] = [];

    for (const itemId of itemIds) {
      const item = await this.itemRepository.findById(itemId);
      if (!item) {
        nonExistentItemIds.push(itemId);
      }
    }

    if (nonExistentItemIds.length > 0) {
      throw new BadRequestException(
        `Não foi possível adicionar itens à demanda. Os seguintes itens não existem: ${nonExistentItemIds.join(', ')}`,
      );
    }

    const existingItems = existingDemand.items || [];

    const newDemandItems = dto.items.map(
      (itemDto) =>
        new DemandItem({
          itemId: itemDto.itemId,
          totalPlan: itemDto.totalPlan,
          totalProduced: itemDto.totalProduced || 0,
          demandId: id,
        }),
    );

    const updatedItems = [...existingItems, ...newDemandItems];

    const updatedDemand = await this.demandRepository.update(id, {
      items: updatedItems,
    });

    if (!updatedDemand) {
      throw new NotFoundException(`Falha ao atualizar a demanda com ID ${id}`);
    }

    return updatedDemand;
  }
}
