import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateDemandItemDto {
  @ApiProperty({
    description: 'ID of the item relation',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    description: 'Item ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  itemId?: number;

  @ApiProperty({
    description: 'Total plan for the item',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  totalPlan?: number;
}
