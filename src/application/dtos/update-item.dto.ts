import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({
    description: 'SKU do item',
    example: 'SKU123',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Descrição do item',
    example: 'Caneta Azul',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
