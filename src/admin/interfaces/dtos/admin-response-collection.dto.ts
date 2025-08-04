import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginatedResponseDto } from '../../../shared/dtos/response.dto';
import { AdminResponseDto } from './admin-response.dto';

export class AdminCollectionResponseDto extends PaginatedResponseDto<
  AdminResponseDto[]
> {
  @ApiProperty({ type: [AdminResponseDto] })
  @Type(() => AdminResponseDto)
  @Expose()
  declare result: AdminResponseDto[];
}
