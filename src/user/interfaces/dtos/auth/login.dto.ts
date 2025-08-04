import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiPropertyOptional({
    description: 'Nombre de usuario',
    example: 'juan123',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'Email del usuario',
    example: 'juan@drinkit.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: '123456',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class SocialAuthCallbackDto {
  @ApiProperty({
    description: 'Datos de estado de la autenticación social',
    example: '{"scheme":"drinkitapp","screens":["login"],"intent":"signin"}',
  })
  @IsString()
  state: string;
}

export class UnlinkSocialDto {
  @ApiProperty({
    description: 'Proveedor de autenticación social',
    example: 'google',
    enum: ['google', 'facebook', 'apple'],
  })
  @IsString()
  provider: 'google' | 'facebook' | 'apple';

  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
  })
  @IsString()
  usersId: string;
}

export class EmailCodeDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan@drinkit.com',
  })
  @IsEmail()
  email: string;
}

export class ValidateCodeDto {
  @ApiProperty({
    description: 'Código de verificación',
    example: '123456',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan@drinkit.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'ID del usuario (opcional)',
    example: '1',
  })
  @IsOptional()
  @IsString()
  usersId?: string;
}
