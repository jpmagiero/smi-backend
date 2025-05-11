import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { DemandStatus } from '../../entities/demand/demand.entity';

export class UpdateDemandDto {
  @ApiProperty({
    description: 'Start date of the demand',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'End date of the demand',
    example: '2023-01-31T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    description: 'Status of the demand',
    enum: DemandStatus,
    example: 'PLANNING',
    required: false,
  })
  @IsOptional()
  @IsEnum(DemandStatus)
  status?: DemandStatus;
}
