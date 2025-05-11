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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'Item created successfully' })
  async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.createItemUseCase.execute(createItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'List of all items' })
  async findAll(): Promise<Item[]> {
    return this.getAllItemsUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item by ID' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Item found' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Item> {
    return this.getItemByIdUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an item' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    return this.updateItemUseCase.execute(id, updateItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.deleteItemUseCase.execute(id);
  }
}
