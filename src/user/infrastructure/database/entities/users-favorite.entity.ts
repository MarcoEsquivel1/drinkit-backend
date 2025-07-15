import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('usersFavorites')
export class UsersFavorite {
  @PrimaryGeneratedColumn()
  usersFavoritesId: number;

  @Column({ type: 'text', nullable: false })
  productId: string;

  @Column({ type: 'int', nullable: false })
  fk_usersId: number;

  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @Column({ type: 'int', nullable: true })
  updatedBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'fk_usersId' })
  user: User;
}
