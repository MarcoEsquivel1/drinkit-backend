import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDto } from '../../../../shared/utils';

class RoleDto {
  @ApiProperty({ description: 'ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Nombre' })
  @Expose()
  name: string;
}

export class AuthenticationDataDto {
  @ApiProperty({ description: 'ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Foto' })
  @Expose()
  photo: string;

  @ApiProperty({ description: 'Nombre' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Apellido' })
  @Expose()
  surname: string;

  @ApiProperty({ description: 'Indicador de activo' })
  @Expose()
  enabled: boolean;

  @ApiProperty({ description: 'Indicador de inicio de sesion' })
  @Expose()
  isLoggedIn: boolean;

  @ApiProperty({ description: 'Datos del rol', type: RoleDto })
  @Type(() => RoleDto)
  @Expose()
  role: RoleDto;
}

export class AuthenticationResponseDto extends ResponseDto<AuthenticationDataDto> {
  @ApiProperty({ type: AuthenticationDataDto })
  @Type(() => AuthenticationDataDto)
  @Expose()
  declare result: AuthenticationDataDto;
}
