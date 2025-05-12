import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateDemandItemDto {
  @ApiProperty({
    description: 'Quantidade total planejada do item',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  totalPlan?: number;

  @ApiProperty({
    description: 'Quantidade total produzida do item',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalProduced?: number;
}
