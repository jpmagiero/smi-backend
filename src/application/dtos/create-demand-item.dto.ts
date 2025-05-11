import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateDemandItemDto {
  @ApiProperty({ description: 'SKU of the item', example: 'SKU123' })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ description: 'Total plan for the item', example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  totalPlan: number;
}
