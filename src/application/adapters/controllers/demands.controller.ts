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
import { CreateDemandDto } from '../../dtos/demand/create-demand.dto';
import { UpdateDemandDto } from '../../dtos/demand/update-demand.dto';
import { Demand } from '../../entities/demand/demand.entity';
import { CreateDemandUseCase } from '../../use-cases/demand/create-demand.use-case';
import { DeleteDemandUseCase } from '../../use-cases/demand/delete-demand.use-case';
import { GetAllDemandsUseCase } from '../../use-cases/demand/get-all-demands.use-case';
import { GetDemandByIdUseCase } from '../../use-cases/demand/get-demand-by-id.use-case';
import { UpdateDemandUseCase } from '../../use-cases/demand/update-demand.use-case';

@ApiTags('demands')
@Controller('demands')
export class DemandsController {
  constructor(
    private readonly createDemandUseCase: CreateDemandUseCase,
    private readonly getAllDemandsUseCase: GetAllDemandsUseCase,
    private readonly getDemandByIdUseCase: GetDemandByIdUseCase,
    private readonly updateDemandUseCase: UpdateDemandUseCase,
    private readonly deleteDemandUseCase: DeleteDemandUseCase,
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
  @ApiOperation({ summary: 'Update a demand' })
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
}
