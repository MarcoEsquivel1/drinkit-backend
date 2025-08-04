import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  IsDateString,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'juanperez',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Transform(({ value }) => (value as string)?.toLowerCase().trim())
  username: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan@example.com',
  })
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }) => (value as string)?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiPassword123!',
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
  password: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => (value as string)?.trim())
  firstname: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (value as string)?.trim())
  lastname: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono',
    example: '+573001234567',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[+]?[1-9][\d]{0,15}$/, {
    message: 'Formato de teléfono inválido',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento',
    example: '1990-01-15',
  })
  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @ApiPropertyOptional({
    description: 'Género del usuario',
    example: 'M',
    enum: ['M', 'F'],
  })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  @Matches(/^[MF]$/, {
    message: 'El género debe ser M (Masculino) o F (Femenino)',
  })
  gender?: string;

  @ApiPropertyOptional({
    description: 'Aceptación de términos y condiciones',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  acceptTerms?: boolean;
}
