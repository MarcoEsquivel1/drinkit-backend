import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SimpleResponseDto } from '../../../shared/dtos/response.dto';
import { AdminResponseDto } from './admin-response.dto';

export class AdminSingleResponseDto extends SimpleResponseDto<AdminResponseDto> {
  @ApiProperty({ type: AdminResponseDto })
  @Type(() => AdminResponseDto)
  @Expose()
  declare result: AdminResponseDto;
}
