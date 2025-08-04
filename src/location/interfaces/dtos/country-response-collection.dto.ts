import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginatedResponseDto } from '../../../shared/dtos/response.dto';
import { CountryResponseDto } from './country-response.dto';

export class CountryCollectionResponseDto extends PaginatedResponseDto<
  CountryResponseDto[]
> {
  @ApiProperty({ type: [CountryResponseDto] })
  @Type(() => CountryResponseDto)
  @Expose()
  declare result: CountryResponseDto[];
}
