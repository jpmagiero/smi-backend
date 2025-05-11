import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'SKU of the item',
    example: 'SKU12345',
  })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({
    description: 'Description of the item',
    example: 'Product description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
