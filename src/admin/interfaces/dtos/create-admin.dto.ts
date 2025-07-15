import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { UserGender } from '../../../shared/infrastructure/database/entities/enums';

export class CreateAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;

  @IsOptional()
  roleId?: number;
}
