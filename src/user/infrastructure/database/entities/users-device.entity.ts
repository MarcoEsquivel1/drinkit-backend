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

@Entity('usersDevices')
export class UsersDevice {
  @PrimaryGeneratedColumn()
  usersDevicesId: number;

  @Column({ type: 'text', nullable: false })
  deviceType: string;

  @Column({ type: 'text', nullable: false })
  deviceId: string;

  @Column({ type: 'text', nullable: true })
  firebaseToken: string;

  @Column({ type: 'text', nullable: true })
  deviceVersion: string;

  @Column({ type: 'text', nullable: true })
  appVersion: string;

  @Column({ type: 'text', nullable: true })
  deviceDescription: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean;

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

  @ManyToOne(() => User, (user) => user.devices)
  @JoinColumn({ name: 'fk_usersId' })
  user: User;
}
