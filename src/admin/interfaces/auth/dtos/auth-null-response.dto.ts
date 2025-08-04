import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SimpleResponseDto } from '../../../../shared/dtos/response.dto';

export class AdminAuthNullResponseDto extends SimpleResponseDto<null> {
  @ApiProperty({ type: 'null' })
  @Expose()
  declare result: null;
}
