import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsPositive,
  IsUrl,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ParanoidWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';
import { Category } from './category.entity';
import { SubCategory } from './subcategory.entity';
import { Variant } from './variant.entity';

@Entity('products')
export class Product extends ParanoidWithIdEntity {
  @Column({ type: 'int', nullable: false, name: 'category_id' })
  @ApiProperty({ description: 'ID de la categoría del producto' })
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Expose()
  categoryId: number;

  @Column({ type: 'int', nullable: false, name: 'subcategory_id' })
  @ApiProperty({ description: 'ID de la subcategoría del producto' })
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Expose()
  subcategoryId: number;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  @ApiProperty({ description: 'Código SKU único del producto', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim().toUpperCase())
  @Expose()
  sku: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Nombre del producto', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  @Expose()
  name: string;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'Descripción detallada del producto' })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @Transform(({ value }) => value?.trim())
  @Expose()
  description: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: 'URL de la imagen del producto' })
  @IsOptional()
  @IsString()
  @IsUrl()
  @Expose()
  image?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  @ApiProperty({
    description: 'Precio regular del producto',
    minimum: 0.01,
    maximum: 999999.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  @Max(999999.99)
  @Expose()
  regularPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @ApiPropertyOptional({
    description: 'Precio promocional del producto',
    minimum: 0,
    maximum: 999999.99,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999999.99)
  @Expose()
  promotionPrice?: number;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si el producto está activo',
    default: true,
  })
  @IsBoolean()
  @Expose()
  active: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  @ApiPropertyOptional({
    description: 'Grado alcohólico del producto (para bebidas)',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Expose()
  alcoholicGrade?: number;

  @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
  @ApiPropertyOptional({
    description: 'Peso del producto en gramos',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Expose()
  weight?: number;

  @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
  @ApiPropertyOptional({ description: 'Tamaño del producto', minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Expose()
  size?: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiPropertyOptional({ description: 'Marca del producto', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Expose()
  brand?: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  @ApiPropertyOptional({
    description: 'Stock disponible del producto',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Expose()
  stock?: number;

  @Column({ type: 'text', array: true, nullable: true })
  @ApiPropertyOptional({
    description: 'Palabras clave para búsqueda',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  keywords?: string[];

  @Column({ type: 'timestamptz', nullable: true, name: 'deactivated_at' })
  @ApiPropertyOptional({ description: 'Fecha de desactivación del producto' })
  @IsOptional()
  @Expose()
  deactivatedAt?: Date;

  @Column({ type: 'int', nullable: false, default: 0 })
  @ApiProperty({
    description: 'Porcentaje de descuento aplicado',
    minimum: 0,
    maximum: 100,
    default: 0,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  @Expose()
  discount: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  @ApiProperty({
    description: 'Indica si el producto tiene envío gratis',
    default: false,
  })
  @IsBoolean()
  @Expose()
  freeDelivery: boolean;

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'unidad' })
  @ApiProperty({
    description: 'Presentación del producto',
    default: 'unidad',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  @Expose()
  presentation: string;

  @Column({ type: 'text', array: true, nullable: false, default: ['00'] })
  @ApiProperty({
    description: 'Códigos de negocio asociados',
    type: [String],
    default: ['00'],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  business: string[];

  @Column({ type: 'text', array: true, nullable: false, default: ['00'] })
  @ApiProperty({
    description: 'Canales de venta asociados',
    type: [String],
    default: ['00'],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  channel: string[];

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  @ApiProperty({ description: 'Categoría del producto', type: () => Category })
  category: Category;

  @ManyToOne(() => SubCategory, (subcategory) => subcategory.products)
  @JoinColumn({ name: 'subcategory_id' })
  @ApiProperty({
    description: 'Subcategoría del producto',
    type: () => SubCategory,
  })
  subcategory: SubCategory;

  @OneToMany(() => Variant, (variant) => variant.product)
  @ApiProperty({ description: 'Variantes del producto', type: () => [Variant] })
  variants: Variant[];

  cartItems: any[];
  orderDetails: any[];
}
