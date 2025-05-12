import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateItemDto } from '../../dtos/item/create-item.dto';
import { UpdateItemDto } from '../../dtos/item/update-item.dto';
import { Item } from '../../entities/item.entity';
import { CreateItemUseCase } from '../../use-cases/item/create-item.use-case';
import { DeleteItemUseCase } from '../../use-cases/item/delete-item.use-case';
import { GetAllItemsUseCase } from '../../use-cases/item/get-all-items.use-case';
import { GetItemByIdUseCase } from '../../use-cases/item/get-item-by-id.use-case';
import { UpdateItemUseCase } from '../../use-cases/item/update-item.use-case';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(
    private readonly createItemUseCase: CreateItemUseCase,
    private readonly getAllItemsUseCase: GetAllItemsUseCase,
    private readonly getItemByIdUseCase: GetItemByIdUseCase,
    private readonly updateItemUseCase: UpdateItemUseCase,
    private readonly deleteItemUseCase: DeleteItemUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create one or multiple items',
    description: 'Creates one or multiple items with SKU and description',
  })
  @ApiBody({
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            sku: { type: 'string', example: 'SKU12345' },
            description: { type: 'string', example: 'Product description' },
          },
          required: ['sku', 'description'],
        },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              sku: { type: 'string', example: 'SKU12345' },
              description: { type: 'string', example: 'Product description' },
            },
            required: ['sku', 'description'],
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Item(s) created successfully',
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            id: { type: 'number', example: 101 },
            sku: { type: 'string', example: 'SKU12345' },
            description: { type: 'string', example: 'Product description' },
          },
        },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 101 },
              sku: { type: 'string', example: 'SKU12345' },
              description: { type: 'string', example: 'Product description' },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - SKU already exists or duplicate SKUs in request',
  })
  async create(
    @Body() createItemDto: CreateItemDto | CreateItemDto[],
  ): Promise<Item | Item[]> {
    return this.createItemUseCase.execute(createItemDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all items',
    description: 'Returns a list of all items in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all items',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 101 },
          sku: { type: 'string', example: 'SKU12345' },
          description: { type: 'string', example: 'Product description' },
        },
      },
    },
  })
  async findAll(): Promise<Item[]> {
    return this.getAllItemsUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an item by ID',
    description: 'Returns detailed information about a specific item',
  })
  @ApiParam({ name: 'id', description: 'Item ID', example: 101 })
  @ApiResponse({
    status: 200,
    description: 'Item found',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 101 },
        sku: { type: 'string', example: 'SKU12345' },
        description: { type: 'string', example: 'Product description' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Item> {
    return this.getItemByIdUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an item',
    description: "Updates an existing item's SKU and/or description",
  })
  @ApiParam({ name: 'id', description: 'Item ID', example: 101 })
  @ApiResponse({
    status: 200,
    description: 'Item updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 101 },
        sku: { type: 'string', example: 'SKU12345-UPDATED' },
        description: { type: 'string', example: 'Updated product description' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 409, description: 'Conflict - SKU already exists' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    return this.updateItemUseCase.execute(id, updateItemDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an item',
    description:
      'Permanently removes an item from the system. Cannot delete items that are associated with demands.',
  })
  @ApiParam({ name: 'id', description: 'Item ID', example: 101 })
  @ApiResponse({ status: 200, description: 'Item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - Item is associated with demands and cannot be deleted',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.deleteItemUseCase.execute(id);
  }
}
