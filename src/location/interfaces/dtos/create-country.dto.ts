import {
  IsString,
  IsOptional,
  Length,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCountryDto {
  @ApiProperty({ description: 'Nombre del país', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string;

  @ApiPropertyOptional({ description: 'Código ISO2 del país', maxLength: 2 })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  @Matches(/^[A-Z]{2}$/, { message: 'ISO2 debe ser 2 letras mayúsculas' })
  @Transform(({ value }: { value: string }) => value?.toUpperCase())
  iso2?: string;

  @ApiPropertyOptional({ description: 'Código ISO3 del país', maxLength: 3 })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/, { message: 'ISO3 debe ser 3 letras mayúsculas' })
  @Transform(({ value }: { value: string }) => value?.toUpperCase())
  iso3?: string;

  @ApiPropertyOptional({
    description: 'Código telefónico del país',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Matches(/^\+?\d+$/, {
    message:
      'Código telefónico debe contener solo números y puede empezar con +',
  })
  phoneCode?: string;
}
