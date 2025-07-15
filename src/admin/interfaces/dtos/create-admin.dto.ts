import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserGender } from '../../../shared/infrastructure/database/entities/enums';

export class CreateAdminDto {
  @ApiProperty({ description: 'Correo electrónico del administrador' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Contraseña del administrador', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Nombre del administrador' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Apellido del administrador' })
  @IsString()
  surname: string;

  @ApiPropertyOptional({ description: 'Teléfono del administrador' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'URL de la foto del administrador' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    description: 'Género del administrador',
    enum: UserGender,
  })
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;

  @ApiPropertyOptional({ description: 'ID del rol del administrador' })
  @IsOptional()
  roleId?: number;
}
