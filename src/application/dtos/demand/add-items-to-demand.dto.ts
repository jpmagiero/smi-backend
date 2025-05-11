import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateDemandItemDto } from './create-demand-item.dto';

export class AddItemsToDemandDto {
  @ApiProperty({
    description: 'Lista de itens a serem adicionados à demanda',
    type: [CreateDemandItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDemandItemDto)
  items: CreateDemandItemDto[];
}
