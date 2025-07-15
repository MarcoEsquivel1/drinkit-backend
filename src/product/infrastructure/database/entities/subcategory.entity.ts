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

@Entity('subCategory')
export class SubCategory {
  @PrimaryGeneratedColumn()
  subCategoryId: number;

  @Column({ type: 'int', nullable: false })
  fk_categoryId: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  imageSubCategory: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  activeSubCategory: boolean;

  @Column({ type: 'date', nullable: true })
  deactivatedAt: Date;

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

  orderDetails: any[];
}
