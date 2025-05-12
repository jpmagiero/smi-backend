import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateDemandItemDto } from './create-demand-item.dto';

export class AddItemsToDemandDto {
  @ApiProperty({
    description: 'List of items to be added to the demand',
    type: [CreateDemandItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDemandItemDto)
  items: CreateDemandItemDto[];
}
