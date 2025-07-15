import { Entity, Column } from 'typeorm';
import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsUrl,
  IsDateString,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ParanoidWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';

export enum BannerType {
  HOME = 'HOME',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
  PROMOTIONAL = 'PROMOTIONAL',
}

@Entity('banners')
export class Banner extends ParanoidWithIdEntity {
  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'URL de la imagen del banner' })
  @IsString()
  @IsUrl()
  @Expose()
  image: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  @ApiProperty({
    description: 'Indica si el banner está activo',
    default: false,
  })
  @IsBoolean()
  @Expose()
  active: boolean;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({ description: 'URL de destino del banner' })
  @IsOptional()
  @IsString()
  @IsUrl()
  @Expose()
  url?: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  @ApiProperty({
    description: 'Número de clics en el banner',
    default: 0,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @Expose()
  clicks: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'Título del banner', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  @Expose()
  title?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ description: 'Subtítulo del banner', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  @Expose()
  subtitle?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiPropertyOptional({
    description: 'Texto del call-to-action',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  @Expose()
  cta?: string;

  @Column({ type: 'enum', enum: BannerType, nullable: false })
  @ApiProperty({ description: 'Tipo de banner', enum: BannerType })
  @IsEnum(BannerType)
  @Expose()
  type: BannerType;

  @Column({ type: 'timestamptz', nullable: true, name: 'start_date' })
  @ApiPropertyOptional({
    description: 'Fecha de inicio de activación del banner',
  })
  @IsOptional()
  @IsDateString()
  @Expose()
  startDate?: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'end_date' })
  @ApiPropertyOptional({ description: 'Fecha de fin de activación del banner' })
  @IsOptional()
  @IsDateString()
  @Expose()
  endDate?: Date;

  @Column({ type: 'text', nullable: true, name: 'mobile_url' })
  @ApiPropertyOptional({
    description: 'URL de la imagen para dispositivos móviles',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @Expose()
  mobileUrl?: string;
}
