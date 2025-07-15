import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  AfterInsert,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { AuditedWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';
import { User } from '../../../../user/infrastructure/database/entities/user.entity';
import { OrderDetail } from './order-detail.entity';
import { OrderHistory } from './order-history.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentType {
  CARD = 'CARD',
  CASH = 'CASH',
  PUNTO_XPRESS = 'PUNTO_XPRESS',
  CREDIT = 'CREDIT',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Entity('orders')
export class Order extends AuditedWithIdEntity {
  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({ description: 'Referencia única de la orden' })
  @IsString()
  reference: string;

  @Column({ type: 'enum', enum: OrderStatus, nullable: false })
  @ApiProperty({ description: 'Estado de la orden', enum: OrderStatus })
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: 'Código de confirmación' })
  @IsOptional()
  @IsString()
  confirmation?: string;

  @Column({ type: 'enum', enum: PaymentType, nullable: false })
  @ApiProperty({ description: 'Tipo de pago', enum: PaymentType })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @Column({ type: 'enum', enum: PaymentStatus, nullable: false })
  @ApiProperty({ description: 'Estado del pago', enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  @ApiProperty({ description: 'Total de la orden' })
  @IsNumber({ maxDecimalPlaces: 2 })
  total: number;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({ description: 'Dirección de entrega' })
  @IsOptional()
  @IsString()
  address?: string;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({ description: 'Apartamento o departamento' })
  @IsOptional()
  @IsString()
  apartment?: string;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({ description: 'Punto de referencia' })
  @IsOptional()
  @IsString()
  referencePoint?: string;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({ description: 'Ubicación específica' })
  @IsOptional()
  @IsString()
  location?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: 'Ciudad de entrega' })
  @IsOptional()
  @IsString()
  city?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: 'Estado de entrega' })
  @IsOptional()
  @IsString()
  state?: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  @ApiPropertyOptional({ description: 'Costo de envío' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  shipping?: number;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  note?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  @ApiProperty({ description: 'Balance pendiente', default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  balance: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  @ApiProperty({
    description: 'Indica si la orden está completada',
    default: false,
  })
  @IsBoolean()
  completed: boolean;

  @Column({ type: 'uuid', nullable: false, name: 'user_id' })
  @ApiProperty({ description: 'ID del usuario que realizó la orden' })
  @IsString()
  userId: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: 'Código de cupón aplicado' })
  @IsOptional()
  @IsString()
  coupon?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: 'Tiempo estimado de entrega' })
  @IsOptional()
  @IsString()
  eta?: string;

  @Column({ type: 'varchar', nullable: false, default: 'app' })
  @ApiProperty({ description: 'Fuente de la orden', default: 'app' })
  @IsString()
  source: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  @ApiProperty({ description: 'Percepción aplicada', default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  perception: number;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({ description: 'Comentarios adicionales' })
  @IsOptional()
  @IsString()
  comment?: string;

  @Column({ type: 'json', nullable: false, default: [] })
  @ApiProperty({
    description: 'Datos de loyalty',
    type: 'array',
    items: { type: 'object' },
  })
  @IsArray()
  loyalty: any[];

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: 'Usuario propietario de la orden',
    type: () => User,
  })
  user: User;

  @OneToMany(() => OrderDetail, (detail) => detail.order)
  @ApiProperty({
    description: 'Detalles de la orden',
    type: () => [OrderDetail],
  })
  details: OrderDetail[];

  @OneToMany(() => OrderHistory, (history) => history.order)
  @ApiProperty({
    description: 'Historial de la orden',
    type: () => [OrderHistory],
  })
  orderHistories: OrderHistory[];

  transactions: any[];

  @AfterInsert()
  async sendNotifications() {
    if ([PaymentType.CARD].includes(this.paymentType)) {
      await this.sendPurchaseSummary();
    } else if (
      [PaymentType.CASH, PaymentType.PUNTO_XPRESS, PaymentType.CREDIT].includes(
        this.paymentType,
      )
    ) {
      await this.sendPurchaseSummary();
    }
  }

  async sendPurchaseSummary() {}
}
