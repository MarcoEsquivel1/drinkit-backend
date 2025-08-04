import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginatedResponseDto } from '../../../shared/dtos/response.dto';
import { CityResponseDto } from './city-response.dto';

export class CityCollectionResponseDto extends PaginatedResponseDto<
  CityResponseDto[]
> {
  @ApiProperty({ type: [CityResponseDto] })
  @Type(() => CityResponseDto)
  @Expose()
  declare result: CityResponseDto[];
}
