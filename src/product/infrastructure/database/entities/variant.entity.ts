import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('variants')
export class Variant {
  @PrimaryGeneratedColumn()
  variantId: number;

  @Column({ type: 'int', nullable: false })
  fk_productId: number;

  @Column({ type: 'varchar', nullable: false })
  sku: string;

  @Column({ type: 'varchar', nullable: false })
  nameProduct: string;

  @Column({ type: 'varchar', nullable: true })
  imageProduct: string;

  @Column({ type: 'double precision', nullable: false })
  regularPrice: number;

  @Column({ type: 'double precision', nullable: true })
  promotionPrice: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'int', nullable: true, default: 0 })
  units: number;

  @Column({ type: 'double precision', nullable: true })
  weight: number;

  @Column({ type: 'date', nullable: true })
  deactivatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'fk_productId' })
  product: Product;
}
