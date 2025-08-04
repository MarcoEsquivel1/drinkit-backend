import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';
import {
  SimpleResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dtos/response.dto';
import { VariantResponseDto } from './variant-response.dto';

export class VariantSingleResponseDto extends SimpleResponseDto<VariantResponseDto> {
  @ApiProperty({ type: VariantResponseDto })
  @Type(() => VariantResponseDto)
  @Expose()
  declare result: VariantResponseDto;
}

export class VariantCollectionResponseDto extends PaginatedResponseDto<
  VariantResponseDto[]
> {
  @ApiProperty({ type: VariantResponseDto, isArray: true })
  @Type(() => VariantResponseDto)
  @Expose()
  declare result: VariantResponseDto[];
}
