import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UserPasswordRecoveryDto {
  @ApiProperty({ description: 'Correo electronico' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'DUI', required: false })
  @IsString()
  @IsOptional()
  readonly dui?: string;

  @ApiProperty({ description: 'Numero de telefono', required: false })
  @IsString()
  @IsOptional()
  readonly phone?: string;

  @ApiProperty({
    description: 'Tipo de Acceso (CUSTOMER o ADMIN)',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly access?: string;
}

export class UserChangePasswordDto {
  @ApiProperty({ description: 'Nueva contraseña' })
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;

  @ApiProperty({ description: 'UUID de la Operacion' })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  readonly uuid: string;
}
