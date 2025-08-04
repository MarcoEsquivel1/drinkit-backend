import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SimpleResponseDto } from '../../../../shared/dtos/response.dto';
import { AuthenticatedUserDto } from './authenticated-user.dto';

export class AuthSingleResponseDto extends SimpleResponseDto<AuthenticatedUserDto> {
  @ApiProperty({ type: AuthenticatedUserDto })
  @Type(() => AuthenticatedUserDto)
  @Expose()
  declare result: AuthenticatedUserDto;
}
