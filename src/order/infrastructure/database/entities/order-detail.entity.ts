import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/product/infrastructure/database/entities/product.entity';
import { Category } from 'src/product/infrastructure/database/entities/category.entity';
import { SubCategory } from 'src/product/infrastructure/database/entities/subcategory.entity';
import { OrderDetailHistory } from './order-detail-history.entity';

@Entity('ordersDetails')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  ordersDetailsId: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  qty: number;

  @Column({ type: 'text', nullable: false })
  image: string;

  @Column({ type: 'double precision', nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  fk_categoryId: number;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'int', nullable: false })
  fk_subCategoryId: number;

  @Column({ type: 'varchar', nullable: true })
  subCategory: string;

  @Column({ type: 'int', nullable: false })
  fk_ordersId: number;

  @Column({ type: 'int', nullable: false })
  fk_productId: number;

  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @Column({ type: 'int', nullable: true })
  updatedBy: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  bonusQty: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  unityPerBox: number;

  @Column({ type: 'double precision', nullable: false, default: 0 })
  discount: number;

  @Column({ type: 'double precision', nullable: false, default: 0 })
  envase: number;

  @Column({ type: 'text', nullable: false, default: 'unidad' })
  presentation: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.details)
  @JoinColumn({ name: 'fk_ordersId' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetails)
  @JoinColumn({ name: 'fk_productId' })
  product: Product;

  @ManyToOne(() => Category, (category) => category.orderDetails)
  @JoinColumn({ name: 'fk_categoryId' })
  productCategory: Category;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.orderDetails)
  @JoinColumn({ name: 'fk_subCategoryId' })
  subcategory: SubCategory;

  @OneToMany(() => OrderDetailHistory, (history) => history.orderDetail)
  detailsHistories: OrderDetailHistory[];
}
