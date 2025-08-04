import { Entity, Column, OneToMany, BeforeInsert } from 'typeorm';
import {
  IsString,
  IsNumber,
  IsInt,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ParanoidWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';
import { CouponUsage } from './coupon-usage.entity';

export enum CouponType {
  TOTAL = 'TOTAL',
  PERCENTAGE = 'PERCENTAGE',
  PRODUCT = 'PRODUCT',
  SHIPPING = 'SHIPPING',
}

export enum PaymentMethod {
  BOTH = 'BOTH',
  CARD = 'CARD',
  CASH = 'CASH',
  CREDIT = 'CREDIT',
}

@Entity('coupons')
export class Coupon extends ParanoidWithIdEntity {
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
    name: 'code',
  })
  @ApiProperty({ description: 'Código único del cupón', maxLength: 50 })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Transform(
    ({ value }) =>
      (typeof value === 'string'
        ? value.trim().toUpperCase()
        : value) as string,
  )
  @Expose()
  code: string;

  @Column({
    type: 'enum',
    enum: CouponType,
    nullable: false,
    default: CouponType.TOTAL,
  })
  @ApiProperty({
    description: 'Tipo de cupón',
    enum: CouponType,
    default: CouponType.TOTAL,
  })
  @IsEnum(CouponType)
  @Expose()
  type: CouponType;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: false,
    default: PaymentMethod.BOTH,
  })
  @ApiProperty({
    description: 'Método de pago aplicable',
    enum: PaymentMethod,
    default: PaymentMethod.BOTH,
  })
  @IsEnum(PaymentMethod)
  @Expose()
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  @ApiProperty({ description: 'Valor del descuento', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Expose()
  value: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
    name: 'min_cost',
  })
  @ApiProperty({
    description: 'Costo mínimo para aplicar el cupón',
    default: 0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Expose()
  minCost: number;

  @Column({ type: 'int', nullable: false, default: -1, name: 'remaining_uses' })
  @ApiProperty({
    description: 'Usos restantes del cupón (-1 = ilimitado)',
    default: -1,
  })
  @IsInt()
  @Min(-1)
  @Expose()
  remainingUses: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  @ApiProperty({
    description: 'Indica si el cupón está activo',
    default: false,
  })
  @IsBoolean()
  @Expose()
  active: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'start_date' })
  @ApiPropertyOptional({ description: 'Fecha de inicio de validez del cupón' })
  @IsOptional()
  @IsDateString()
  @Expose()
  startDate?: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'end_date' })
  @ApiPropertyOptional({ description: 'Fecha de fin de validez del cupón' })
  @IsOptional()
  @IsDateString()
  @Expose()
  endDate?: Date;

  @Column({ type: 'int', nullable: false, default: -1, name: 'uses_per_user' })
  @ApiProperty({
    description: 'Usos permitidos por usuario (-1 = ilimitado)',
    default: -1,
  })
  @IsInt()
  @Min(-1)
  @Expose()
  usesPerUser: number;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'only_first_order',
  })
  @ApiProperty({
    description: 'Solo válido para primera orden',
    default: false,
  })
  @IsBoolean()
  @Expose()
  onlyFirstOrder: boolean;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
    name: 'max_discount',
  })
  @ApiProperty({
    description: 'Descuento máximo aplicable',
    default: 0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Expose()
  maxDiscount: number;

  @Column({ type: 'int', nullable: false, default: 0, name: 'max_quantity' })
  @ApiProperty({
    description: 'Cantidad máxima de productos aplicables',
    default: 0,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @Expose()
  maxQuantity: number;

  @Column({ type: 'int', array: true, nullable: true, default: [] })
  @ApiPropertyOptional({
    description: 'IDs de categorías aplicables',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Expose()
  categories?: number[];

  @Column({ type: 'int', array: true, nullable: true, default: [] })
  @ApiPropertyOptional({
    description: 'IDs de subcategorías aplicables',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Expose()
  subcategories?: number[];

  @Column({ type: 'int', array: true, nullable: false, default: [] })
  @ApiProperty({ description: 'IDs de productos aplicables', type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @Expose()
  products: number[];

  @Column({ type: 'uuid', array: true, nullable: true, default: [] })
  @ApiPropertyOptional({
    description: 'IDs de usuarios que pueden usar el cupón',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  users?: string[];

  @Column({ type: 'json', nullable: false, default: [] })
  @ApiProperty({
    description: 'Reglas adicionales del cupón',
    type: 'array',
    items: { type: 'object' },
  })
  @IsArray()
  @Expose()
  rules: any[];

  @OneToMany(() => CouponUsage, (usage) => usage.coupon)
  @ApiProperty({ description: 'Usos del cupón', type: () => [CouponUsage] })
  usages: CouponUsage[];

  @BeforeInsert()
  normalizeCouponData() {
    this.code = this.code.toString().trim().toUpperCase();
    this.paymentMethod = this.paymentMethod
      .toString()
      .trim()
      .toUpperCase() as PaymentMethod;
    this.type = this.type.toString().trim().toUpperCase() as CouponType;
  }
}
