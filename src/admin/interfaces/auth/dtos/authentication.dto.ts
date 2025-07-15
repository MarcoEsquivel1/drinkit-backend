import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserAuthenticationDto {
  @ApiProperty({ description: 'Correo electronico' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'Contraseña de acceso' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: 'Flag para recordar la cuenta', required: false })
  @IsBoolean()
  @IsOptional()
  readonly remember?: boolean;
}
