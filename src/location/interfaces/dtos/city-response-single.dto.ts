import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SimpleResponseDto } from '../../../shared/dtos/response.dto';
import { CityResponseDto } from './city-response.dto';

export class CitySingleResponseDto extends SimpleResponseDto<CityResponseDto> {
  @ApiProperty({ type: CityResponseDto })
  @Type(() => CityResponseDto)
  @Expose()
  declare result: CityResponseDto;
}
