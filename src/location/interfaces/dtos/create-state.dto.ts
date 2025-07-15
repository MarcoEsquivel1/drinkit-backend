import {
  IsString,
  IsInt,
  IsPositive,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateStateDto {
  @ApiProperty({ description: 'Nombre del estado/provincia', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string;

  @ApiProperty({ description: 'ID del país al que pertenece el estado' })
  @IsInt()
  @IsPositive()
  countryId: number;
}
