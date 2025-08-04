import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';
import {
  SimpleResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dtos/response.dto';
import { ProductResponseDto } from './product-response.dto';

export class ProductSingleResponseDto extends SimpleResponseDto<ProductResponseDto> {
  @ApiProperty({ type: ProductResponseDto })
  @Type(() => ProductResponseDto)
  @Expose()
  declare result: ProductResponseDto;
}

export class ProductCollectionResponseDto extends PaginatedResponseDto<
  ProductResponseDto[]
> {
  @ApiProperty({ type: ProductResponseDto, isArray: true })
  @Type(() => ProductResponseDto)
  @Expose()
  declare result: ProductResponseDto[];
}
