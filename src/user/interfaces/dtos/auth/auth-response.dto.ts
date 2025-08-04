import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SimpleResponseDto } from '../../../../shared/dtos/response.dto';

export class AuthTokenResponseDto {
  @ApiProperty({
    description: 'Token JWT de autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  token: string;
}

export class UserProfileDto {
  @ApiProperty({ description: 'ID del usuario' })
  @Expose()
  usersId: number;

  @ApiProperty({ description: 'Nombre del usuario' })
  @Expose()
  firstname: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @Expose()
  lastname: string;

  @ApiPropertyOptional({ description: 'Nombre de usuario' })
  @Expose()
  username?: string;

  @ApiPropertyOptional({ description: 'URL de la foto del usuario' })
  @Expose()
  photo?: string;

  @ApiProperty({ description: 'Información del rol' })
  @Expose()
  @Type(() => Object)
  role: {
    rolesId: number;
    name: string;
  };
}

export class SocialProfileDto {
  @ApiProperty({ description: 'Proveedor de autenticación' })
  @Expose()
  provider: string;

  @ApiProperty({ description: 'ID del proveedor' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nombre completo para mostrar' })
  @Expose()
  displayName: string;

  @ApiProperty({ description: 'Nombre' })
  @Expose()
  firstname: string;

  @ApiProperty({ description: 'Apellido' })
  @Expose()
  lastname: string;

  @ApiProperty({ description: 'Email' })
  @Expose()
  email: string;

  @ApiPropertyOptional({ description: 'URL de la foto' })
  @Expose()
  photo?: string;
}

export class AuthTokenSingleResponseDto extends SimpleResponseDto<AuthTokenResponseDto> {
  @ApiProperty({ type: AuthTokenResponseDto })
  @Type(() => AuthTokenResponseDto)
  declare result: AuthTokenResponseDto;
}

export class AuthUserSingleResponseDto extends SimpleResponseDto<UserProfileDto> {
  @ApiProperty({ type: UserProfileDto })
  @Type(() => UserProfileDto)
  declare result: UserProfileDto;
}

export class UserAuthNullResponseDto extends SimpleResponseDto<null> {
  @ApiProperty({ type: 'null' })
  declare result: null;
}
