import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginatedResponseDto } from '../../../shared/dtos/response.dto';
import { StateResponseDto } from './state-response.dto';

export class StateCollectionResponseDto extends PaginatedResponseDto<
  StateResponseDto[]
> {
  @ApiProperty({ type: [StateResponseDto] })
  @Type(() => StateResponseDto)
  @Expose()
  declare result: StateResponseDto[];
}
