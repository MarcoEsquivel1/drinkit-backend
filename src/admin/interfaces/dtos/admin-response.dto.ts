import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserGender } from '../../../shared/infrastructure/database/entities/enums';

export class AdminResponseDto {
  @ApiProperty({ description: 'ID único del administrador' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Email del administrador' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Nombre del administrador' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Apellido del administrador' })
  @Expose()
  surname: string;

  @ApiProperty({ description: 'Estado habilitado del administrador' })
  @Expose()
  enabled: boolean;

  @ApiPropertyOptional({ description: 'Teléfono del administrador' })
  @Expose()
  phone?: string;

  @ApiPropertyOptional({ description: 'Foto del administrador' })
  @Expose()
  photo?: string;

  @ApiProperty({ description: 'Género del administrador' })
  @Expose()
  gender: UserGender;

  @ApiPropertyOptional({ description: 'ID del rol del administrador' })
  @Expose()
  roleId?: number;

  @ApiPropertyOptional({ description: 'Indicador de sesión iniciada' })
  @Expose()
  isLoggedIn?: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de última actualización' })
  @Expose()
  updatedAt?: Date;
}
