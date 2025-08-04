import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';
import {
  SimpleResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dtos/response.dto';
import { CategoryResponseDto } from './category-response.dto';

export class CategorySingleResponseDto extends SimpleResponseDto<CategoryResponseDto> {
  @ApiProperty({ type: CategoryResponseDto })
  @Type(() => CategoryResponseDto)
  @Expose()
  declare result: CategoryResponseDto;
}

export class CategoryCollectionResponseDto extends PaginatedResponseDto<
  CategoryResponseDto[]
> {
  @ApiProperty({ type: CategoryResponseDto, isArray: true })
  @Type(() => CategoryResponseDto)
  @Expose()
  declare result: CategoryResponseDto[];
}
