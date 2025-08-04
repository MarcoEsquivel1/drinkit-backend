import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import {
  SimpleResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dtos/response.dto';

export class CreateAppleFallbackDto {
  @ApiProperty({
    description: 'ID único de Apple',
    example: '118299716775493856155',
  })
  @IsString()
  appleId: string;

  @ApiPropertyOptional({
    description: 'Apellido del usuario',
    example: 'Perez',
  })
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiPropertyOptional({
    description: 'Email del usuario',
    example: 'juan.perez@drinkit.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Nombre completo para mostrar',
    example: 'Juan Perez',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto del usuario',
    example: 'https://example.com/photo.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}

export class UpdateAppleFallbackDto {
  @ApiPropertyOptional({
    description: 'Apellido del usuario',
    example: 'Perez',
  })
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiPropertyOptional({
    description: 'Email del usuario',
    example: 'juan.perez@drinkit.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Nombre completo para mostrar',
    example: 'Juan Perez',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto del usuario',
    example: 'https://example.com/photo.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}

export class AppleFallbackResponseDto {
  @ApiProperty({ description: 'ID del Apple Fallback' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'ID único de Apple' })
  @Expose()
  appleId: string;

  @ApiPropertyOptional({ description: 'Apellido del usuario' })
  @Expose()
  lastname?: string;

  @ApiPropertyOptional({ description: 'Nombre del usuario' })
  @Expose()
  firstname?: string;

  @ApiPropertyOptional({ description: 'Email del usuario' })
  @Expose()
  email?: string;

  @ApiPropertyOptional({ description: 'Nombre completo para mostrar' })
  @Expose()
  displayName?: string;

  @ApiPropertyOptional({ description: 'URL de la foto del usuario' })
  @Expose()
  photo?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @Expose()
  updatedAt: Date;
}

export class AppleFallbackSingleResponseDto extends SimpleResponseDto<AppleFallbackResponseDto> {
  @ApiProperty({ type: AppleFallbackResponseDto })
  @Type(() => AppleFallbackResponseDto)
  declare result: AppleFallbackResponseDto;
}

export class AppleFallbackCollectionResponseDto extends PaginatedResponseDto<
  AppleFallbackResponseDto[]
> {
  @ApiProperty({ type: [AppleFallbackResponseDto] })
  @Type(() => AppleFallbackResponseDto)
  declare result: AppleFallbackResponseDto[];
}

export class AppleFallbackCountResponseDto extends SimpleResponseDto<{
  count: number;
}> {
  @ApiProperty({ type: 'object', properties: { count: { type: 'number' } } })
  declare result: { count: number };
}
