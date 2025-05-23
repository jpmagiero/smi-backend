import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateDemandItemDto {
  @ApiProperty({ description: 'Item ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @ApiProperty({ description: 'Total plan for the item', example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  totalPlan: number;

  @ApiProperty({
    description: 'Total produced quantity',
    example: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  totalProduced?: number;
}
