import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  SimpleResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dtos/response.dto';
import { UserResponseDto } from './user-response.dto';

export class UserSingleResponseDto extends SimpleResponseDto<UserResponseDto> {
  @ApiProperty({ type: UserResponseDto })
  @Type(() => UserResponseDto)
  declare result: UserResponseDto;
}

export class UserCollectionResponseDto extends PaginatedResponseDto<
  UserResponseDto[]
> {
  @ApiProperty({ type: [UserResponseDto] })
  @Type(() => UserResponseDto)
  declare result: UserResponseDto[];
}

export class UserNullResponseDto extends SimpleResponseDto<null> {
  @ApiProperty({ type: 'null' })
  declare result: null;
}
