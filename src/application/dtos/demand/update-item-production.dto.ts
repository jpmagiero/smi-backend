import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateDemandItemDto {
  @ApiProperty({
    description: 'Total planned quantity of the item',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  totalPlan?: number;

  @ApiProperty({
    description: 'Total produced quantity of the item',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalProduced?: number;
}
