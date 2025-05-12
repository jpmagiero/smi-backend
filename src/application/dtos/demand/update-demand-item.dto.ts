import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateDemandItemDto {
  @ApiProperty({
    description: 'Total planned quantity',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPlan?: number;

  @ApiProperty({
    description: 'Total produced quantity',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalProduced?: number;
}
