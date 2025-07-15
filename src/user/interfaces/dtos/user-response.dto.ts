import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEmail,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class UserResponseDto {
  @Expose()
  @IsNumber()
  userId: number;

  @Expose()
  @IsOptional()
  @IsString()
  username?: string;

  @Expose()
  @IsBoolean()
  active: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  firstname?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lastname?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Expose()
  @IsOptional()
  @IsString()
  phone?: string;

  @Expose()
  @IsBoolean()
  verify: boolean;

  @Expose()
  @IsOptional()
  @IsDateString()
  birthdate?: Date;

  @Expose()
  @IsOptional()
  @IsString()
  photo?: string;

  @Expose()
  @IsOptional()
  @IsString()
  gender?: string;

  @Expose()
  @IsString()
  companyname: string;

  @Expose()
  @IsString()
  business: string;

  @Expose()
  @IsString()
  channel: string;

  @Expose()
  @Transform(({ value }) =>
    value ? `${value.firstname} ${value.lastname}`.trim() : null,
  )
  fullName?: string;

  @Expose()
  @IsDateString()
  createdAt: Date;

  @Expose()
  @IsDateString()
  updatedAt: Date;
}
