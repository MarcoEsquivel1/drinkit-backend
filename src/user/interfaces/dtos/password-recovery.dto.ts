import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordRecoveryDto {
  @ApiProperty({
    description: 'Email del usuario para recuperar contraseña',
    example: 'usuario@example.com',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token de recuperación recibido por email',
    example: 'abc123def456',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Nueva contraseña',
    example: 'MiNuevaPassword123!',
    minLength: 6,
    maxLength: 128,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número o símbolo',
  })
  newPassword: string;
}
