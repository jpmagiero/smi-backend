import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { DemandStatus } from '../../entities/demand/demand.entity';
import { CreateDemandItemDto } from './create-demand-item.dto';

export class CreateDemandDto {
  @ApiProperty({
    description: 'Start date of the demand',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'End date of the demand',
    example: '2023-01-31T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    description: 'Status of the demand',
    enum: DemandStatus,
    example: 'PLANNING',
  })
  @IsNotEmpty()
  @IsEnum(DemandStatus)
  status: DemandStatus;

  @ApiProperty({
    description: 'List of demand items',
    type: [CreateDemandItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDemandItemDto)
  items?: CreateDemandItemDto[];
}
