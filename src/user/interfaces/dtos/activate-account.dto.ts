import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivateAccountDto {
  @ApiProperty({
    description: 'Código de verificación enviado por email',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  code: string;

  @ApiProperty({
    description: 'Email del usuario a activar',
    example: 'usuario@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
