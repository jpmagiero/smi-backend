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
import { DemandSummary } from '../../entities/demand/demand.interface';
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
  @ApiOperation({
    summary: 'Create a new demand',
    description:
      'Creates a new demand with start date, end date, and optional items',
  })
  @ApiResponse({
    status: 201,
    description: 'Demand created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        startDate: {
          type: 'string',
          format: 'date-time',
          example: '2023-05-01T00:00:00.000Z',
        },
        endDate: {
          type: 'string',
          format: 'date-time',
          example: '2023-05-31T00:00:00.000Z',
        },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              demandId: { type: 'number', example: 1 },
              itemId: { type: 'number', example: 101 },
              totalPlan: { type: 'number', example: 100 },
              totalProduced: { type: 'number', example: 0 },
              item: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 101 },
                  sku: { type: 'string', example: 'SKU123' },
                  description: {
                    type: 'string',
                    example: 'Product description',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or nonexistent items',
  })
  async create(@Body() createDemandDto: CreateDemandDto): Promise<Demand> {
    return this.createDemandUseCase.execute(createDemandDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all demands',
    description: 'Returns a list of all demands with summary information',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all demands',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          startDate: {
            type: 'string',
            format: 'date-time',
            example: '2023-05-01T00:00:00.000Z',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            example: '2023-05-31T00:00:00.000Z',
          },
          totalPlan: { type: 'number', example: 100 },
          totalProd: { type: 'number', example: 25 },
          status: {
            type: 'string',
            enum: ['PLANNING', 'IN_PROGRESS', 'COMPLETED'],
            example: 'IN_PROGRESS',
          },
        },
      },
    },
  })
  async findAll(): Promise<DemandSummary[]> {
    return this.getAllDemandsUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a demand by ID',
    description: 'Returns detailed information about a specific demand',
  })
  @ApiParam({ name: 'id', description: 'Demand ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Demand found',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        startDate: {
          type: 'string',
          format: 'date-time',
          example: '2023-05-01T00:00:00.000Z',
        },
        endDate: {
          type: 'string',
          format: 'date-time',
          example: '2023-05-31T00:00:00.000Z',
        },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              demandId: { type: 'number', example: 1 },
              itemId: { type: 'number', example: 101 },
              totalPlan: { type: 'number', example: 100 },
              totalProduced: { type: 'number', example: 25 },
              item: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 101 },
                  sku: { type: 'string', example: 'SKU123' },
                  description: {
                    type: 'string',
                    example: 'Product description',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Demand not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Demand> {
    return this.getDemandByIdUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a demand',
    description:
      'Updates the basic information of a demand (start date, end date) without changing the items. To manage items, use the specific endpoints.',
  })
  @ApiParam({ name: 'id', description: 'Demand ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Demand updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        startDate: {
          type: 'string',
          format: 'date-time',
          example: '2023-06-01T00:00:00.000Z',
        },
        endDate: {
          type: 'string',
          format: 'date-time',
          example: '2023-06-30T00:00:00.000Z',
        },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              demandId: { type: 'number', example: 1 },
              itemId: { type: 'number', example: 101 },
              totalPlan: { type: 'number', example: 100 },
              totalProduced: { type: 'number', example: 25 },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Demand not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDemandDto: UpdateDemandDto,
  ): Promise<Demand> {
    return this.updateDemandUseCase.execute(id, updateDemandDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a demand',
    description: 'Permanently removes a demand and all its associated items',
  })
  @ApiParam({ name: 'id', description: 'Demand ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Demand deleted successfully' })
  @ApiResponse({ status: 404, description: 'Demand not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.deleteDemandUseCase.execute(id);
  }

  @Post(':id/items')
  @ApiOperation({
    summary: 'Add items to a demand',
    description:
      'Allows adding new items to an existing demand without modifying the existing items. Each item must not already exist in the demand.',
  })
  @ApiParam({ name: 'id', description: 'Demand ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Items added successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        startDate: {
          type: 'string',
          format: 'date-time',
          example: '2023-05-01T00:00:00.000Z',
        },
        endDate: {
          type: 'string',
          format: 'date-time',
          example: '2023-05-31T00:00:00.000Z',
        },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              demandId: { type: 'number', example: 1 },
              itemId: { type: 'number', example: 101 },
              totalPlan: { type: 'number', example: 100 },
              totalProduced: { type: 'number', example: 0 },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Demand not found' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid or nonexistent items',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Items already exist in the demand',
  })
  async addItems(
    @Param('id', ParseIntPipe) id: number,
    @Body() addItemsDto: AddItemsToDemandDto,
  ): Promise<Demand> {
    return this.addItemsToDemandUseCase.execute(id, addItemsDto);
  }

  @Delete(':demandId/items/:itemId')
  @ApiOperation({
    summary: 'Remove a specific item from a demand',
    description:
      'Removes only the specified item from the demand without affecting other items',
  })
  @ApiParam({ name: 'demandId', description: 'Demand ID', example: 1 })
  @ApiParam({
    name: 'itemId',
    description: 'Item ID to be removed',
    example: 101,
  })
  @ApiResponse({
    status: 200,
    description: 'Item removed successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        startDate: {
          type: 'string',
          format: 'date-time',
          example: '2023-05-01T00:00:00.000Z',
        },
        endDate: {
          type: 'string',
          format: 'date-time',
          example: '2023-05-31T00:00:00.000Z',
        },
        items: {
          type: 'array',
          description: 'The updated list of items (without the removed item)',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              demandId: { type: 'number', example: 1 },
              itemId: { type: 'number', example: 102 },
              totalPlan: { type: 'number', example: 50 },
              totalProduced: { type: 'number', example: 10 },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Demand or item not found' })
  async removeItem(
    @Param('demandId', ParseIntPipe) demandId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<Demand> {
    return this.removeItemFromDemandUseCase.execute(demandId, itemId);
  }

  @Patch('items/:id')
  @ApiOperation({
    summary: 'Update a demand item',
    description:
      'Updates the totalPlan and/or totalProduced values for a specific demand item',
  })
  @ApiResponse({
    status: 200,
    description: 'Demand item updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        demandId: { type: 'number', example: 1 },
        itemId: { type: 'number', example: 101 },
        totalPlan: { type: 'number', example: 120 },
        totalProduced: { type: 'number', example: 40 },
        item: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 101 },
            sku: { type: 'string', example: 'SKU123' },
            description: { type: 'string', example: 'Product description' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Demand item not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiParam({ name: 'id', description: 'Demand item ID', example: 1 })
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
