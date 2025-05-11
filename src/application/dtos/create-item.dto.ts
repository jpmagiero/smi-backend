import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ description: 'SKU do item', example: 'SKU123' })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ description: 'Descrição do item', example: 'Caneta Azul' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
