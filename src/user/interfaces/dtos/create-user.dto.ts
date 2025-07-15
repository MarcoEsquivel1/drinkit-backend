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

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Transform(({ value }) => value?.toLowerCase().trim())
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número o símbolo',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  firstname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  lastname?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, {
    message: 'Formato de teléfono inválido',
  })
  phone?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1)
  @Matches(/^[MF]$/, {
    message: 'El género debe ser M (Masculino) o F (Femenino)',
  })
  gender?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  companyname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  business?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  channel?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
