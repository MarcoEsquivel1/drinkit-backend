import {
  IsString,
  IsNumber,
  IsInt,
  IsPositive,
  Min,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCityDto {
  @ApiProperty({ description: 'Nombre de la ciudad', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string;

  @ApiPropertyOptional({
    description: 'Costo de envío para la ciudad',
    default: 4,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  shipping?: number;

  @ApiProperty({ description: 'ID del estado al que pertenece la ciudad' })
  @IsInt()
  @IsPositive()
  stateId: number;
}
