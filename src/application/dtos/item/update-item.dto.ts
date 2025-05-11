import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({
    description: 'SKU of the item',
    example: 'SKU12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Description of the item',
    example: 'Product description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
