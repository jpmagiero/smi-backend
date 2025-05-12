import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateDemandDto } from '../../dtos/demand/create-demand.dto';
import { UpdateDemandDto } from '../../dtos/demand/update-demand.dto';
import { AddItemsToDemandDto } from '../../dtos/demand/add-items-to-demand.dto';
import { UpdateDemandItemDto } from '../../dtos/demand/update-demand-item.dto';
import { Demand } from '../../entities/demand/demand.entity';
import { CreateDemandUseCase } from '../../use-cases/demand/create-demand.use-case';
import { DeleteDemandUseCase } from '../../use-cases/demand/delete-demand.use-case';
import { GetAllDemandsUseCase } from '../../use-cases/demand/get-all-demands.use-case';
import { GetDemandByIdUseCase } from '../../use-cases/demand/get-demand-by-id.use-case';
import { UpdateDemandUseCase } from '../../use-cases/demand/update-demand.use-case';
import { AddItemsToDemandUseCase } from '../../use-cases/demand/add-items-to-demand.use-case';
import { RemoveItemFromDemandUseCase } from '../../use-cases/demand/remove-item-from-demand.use-case';
import { UpdateDemandItemUseCase } from '../../use-cases/demand/update-demand-item.use-case';
import { DemandItem } from '../../entities/demand/demand-item.entity';

@ApiTags('demands')
@Controller('demands')
export class DemandsController {
  constructor(
    private readonly createDemandUseCase: CreateDemandUseCase,
    private readonly getAllDemandsUseCase: GetAllDemandsUseCase,
    private readonly getDemandByIdUseCase: GetDemandByIdUseCase,
    private readonly updateDemandUseCase: UpdateDemandUseCase,
    private readonly deleteDemandUseCase: DeleteDemandUseCase,
    private readonly addItemsToDemandUseCase: AddItemsToDemandUseCase,
    private readonly removeItemFromDemandUseCase: RemoveItemFromDemandUseCase,
    private readonly updateDemandItemUseCase: UpdateDemandItemUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new demand' })
  @ApiResponse({ status: 201, description: 'Demand created successfully' })
  async create(@Body() createDemandDto: CreateDemandDto): Promise<Demand> {
    return this.createDemandUseCase.execute(createDemandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all demands' })
  @ApiResponse({ status: 200, description: 'List of all demands' })
  async findAll(): Promise<Demand[]> {
    return this.getAllDemandsUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a demand by ID' })
  @ApiParam({ name: 'id', description: 'Demand ID' })
  @ApiResponse({ status: 200, description: 'Demand found' })
  @ApiResponse({ status: 404, description: 'Demand not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Demand> {
    return this.getDemandByIdUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar uma demanda',
    description:
      'Atualiza apenas os dados básicos da demanda (startDate, endDate, status). Para gerenciar itens, utilize os endpoints específicos.',
  })
  @ApiParam({ name: 'id', description: 'Demand ID' })
  @ApiResponse({ status: 200, description: 'Demand updated successfully' })
  @ApiResponse({ status: 404, description: 'Demand not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDemandDto: UpdateDemandDto,
  ): Promise<Demand> {
    return this.updateDemandUseCase.execute(id, updateDemandDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a demand' })
  @ApiParam({ name: 'id', description: 'Demand ID' })
  @ApiResponse({ status: 200, description: 'Demand deleted successfully' })
  @ApiResponse({ status: 404, description: 'Demand not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.deleteDemandUseCase.execute(id);
  }

  @Post(':id/items')
  @ApiOperation({
    summary: 'Adicionar itens a uma demanda existente',
    description:
      'Permite adicionar novos itens à demanda sem alterar os itens existentes',
  })
  @ApiParam({ name: 'id', description: 'ID da demanda' })
  @ApiResponse({ status: 200, description: 'Itens adicionados com sucesso' })
  @ApiResponse({ status: 404, description: 'Demanda não encontrada' })
  @ApiResponse({ status: 400, description: 'Itens inválidos ou inexistentes' })
  async addItems(
    @Param('id', ParseIntPipe) id: number,
    @Body() addItemsDto: AddItemsToDemandDto,
  ): Promise<Demand> {
    return this.addItemsToDemandUseCase.execute(id, addItemsDto);
  }

  @Delete(':demandId/items/:itemId')
  @ApiOperation({
    summary: 'Remover um item específico de uma demanda',
    description: 'Remove apenas o item especificado da demanda',
  })
  @ApiParam({ name: 'demandId', description: 'ID da demanda' })
  @ApiParam({ name: 'itemId', description: 'ID do item a ser removido' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Demanda ou item não encontrado' })
  async removeItem(
    @Param('demandId', ParseIntPipe) demandId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<Demand> {
    return this.removeItemFromDemandUseCase.execute(demandId, itemId);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update of a demand item' })
  @ApiResponse({
    status: 200,
    description: 'Demand item updated successfully',
  })
  @ApiParam({ name: 'id', description: 'Demand item ID' })
  async updateDemandItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateDemandItemDto,
  ): Promise<DemandItem> {
    return this.updateDemandItemUseCase.execute(
      id,
      updateData.totalPlan,
      updateData.totalProduced,
    );
  }
}
