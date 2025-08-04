import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';
import {
  SimpleResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dtos/response.dto';
import { SubCategoryResponseDto } from './subcategory-response.dto';

export class SubCategorySingleResponseDto extends SimpleResponseDto<SubCategoryResponseDto> {
  @ApiProperty({ type: SubCategoryResponseDto })
  @Type(() => SubCategoryResponseDto)
  @Expose()
  declare result: SubCategoryResponseDto;
}

export class SubCategoryCollectionResponseDto extends PaginatedResponseDto<
  SubCategoryResponseDto[]
> {
  @ApiProperty({ type: SubCategoryResponseDto, isArray: true })
  @Type(() => SubCategoryResponseDto)
  @Expose()
  declare result: SubCategoryResponseDto[];
}
