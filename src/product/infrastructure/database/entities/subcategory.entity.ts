import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Product } from './product.entity';
import { OrderDetail } from '../../../../order/infrastructure/database/entities/order-detail.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('subCategory')
export class SubCategory {
  @PrimaryGeneratedColumn()
  subCategoryId: number;

  @Column({ type: 'int', nullable: false })
  fk_categoryId: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  imageSubCategory: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  activeSubCategory: boolean;

  @Column({ type: 'int', nullable: false, default: 0 })
  discount: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  freeDelivery: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Category, (category) => category.subcategories)
  @JoinColumn({ name: 'fk_categoryId' })
  category: Category;

  @OneToMany(() => Product, (product) => product.subcategory)
  products: Product[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.subcategory)
  @ApiProperty({
    description: 'Detalles de la orden',
    type: () => [OrderDetail],
  })
  orderDetails: OrderDetail[];
}
