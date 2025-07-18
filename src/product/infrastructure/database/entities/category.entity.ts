import { Entity, Column, OneToMany } from 'typeorm';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ParanoidWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';
import { Product } from './product.entity';
import { SubCategory } from './subcategory.entity';

@Entity('categories')
export class Category extends ParanoidWithIdEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Nombre de la categoría', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  @Expose()
  name: string;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'Descripción de la categoría' })
  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  @Transform(({ value }) => value?.trim())
  @Expose()
  description: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: 'URL de la imagen de la categoría' })
  @IsOptional()
  @IsString()
  @IsUrl()
  @Expose()
  image?: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  @ApiProperty({
    description: 'Indica si la categoría está activa',
    default: true,
  })
  @IsBoolean()
  @Expose()
  active: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'deactivated_at' })
  @ApiPropertyOptional({
    description: 'Fecha de desactivación de la categoría',
  })
  @IsOptional()
  @Expose()
  deactivatedAt?: Date;

  @Column({ type: 'int', nullable: false, default: 0 })
  @ApiProperty({
    description: 'Porcentaje de descuento aplicado a la categoría',
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
    description: 'Indica si la categoría tiene envío gratis',
    default: false,
  })
  @IsBoolean()
  @Expose()
  freeDelivery: boolean;

  @OneToMany(() => Product, (product) => product.category)
  @ApiProperty({
    description: 'Productos de la categoría',
    type: () => [Product],
  })
  products: Product[];

  @OneToMany(() => SubCategory, (subcategory) => subcategory.category)
  @ApiProperty({
    description: 'Subcategorías de la categoría',
    type: () => [SubCategory],
  })
  subcategories: SubCategory[];

  orderDetails: any[];
}
