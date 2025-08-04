import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn()
  offersId: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  subtitle: string;

  @Column({ type: 'text', nullable: true })
  banner: string;

  @Column({ type: 'text', nullable: true })
  thumbnail: string;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ type: 'timestamp', nullable: false })
  startline: Date;

  @Column({ type: 'timestamp', nullable: false })
  deadline: Date;

  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  freeDelivery: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  isFlashOffer: boolean;

  @Column({ type: 'json', nullable: false, default: [] })
  products: number[];

  @Column({ type: 'json', nullable: false, default: [] })
  categories: number[];

  @Column({ type: 'json', nullable: false, default: [] })
  subcategories: number[];

  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @Column({ type: 'int', nullable: true })
  updatedBy: number;

  @Column({ type: 'int', nullable: true })
  kit: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
