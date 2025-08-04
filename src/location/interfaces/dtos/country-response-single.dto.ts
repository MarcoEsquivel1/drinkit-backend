import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SimpleResponseDto } from '../../../shared/dtos/response.dto';
import { CountryResponseDto } from './country-response.dto';

export class CountrySingleResponseDto extends SimpleResponseDto<CountryResponseDto> {
  @ApiProperty({ type: CountryResponseDto })
  @Type(() => CountryResponseDto)
  @Expose()
  declare result: CountryResponseDto;
}
