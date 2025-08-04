import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SimpleResponseDto } from '../../../shared/dtos/response.dto';
import { StateResponseDto } from './state-response.dto';

export class StateSingleResponseDto extends SimpleResponseDto<StateResponseDto> {
  @ApiProperty({ type: StateResponseDto })
  @Type(() => StateResponseDto)
  @Expose()
  declare result: StateResponseDto;
}
