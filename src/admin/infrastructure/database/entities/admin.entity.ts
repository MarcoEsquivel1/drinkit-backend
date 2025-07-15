import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseUserWithUuidEntity } from '../../../../shared/infrastructure/database/entities/base';
import { Role } from '../../../../user/infrastructure/database/entities/role.entity';
import { AdminDevice } from './admin-device.entity';

@Entity('admins')
export class Admin extends BaseUserWithUuidEntity {
  @Column({ type: 'integer', default: 2, name: 'fk_role_id' })
  roleId?: number;

  @Column({ nullable: true, name: 'reset_token' })
  resetToken?: string;

  @Column({ nullable: true, name: 'reset_expires' })
  resetExpires?: Date;

  @Column({ default: false, name: 'is_logged_in' })
  isLoggedIn?: boolean;

  @ManyToOne(() => Role, (role) => role.admins)
  @JoinColumn({ name: 'fk_role_id' })
  role: Role;

  @OneToMany(() => AdminDevice, (device) => device.admin, {
    cascade: ['insert'],
  })
  devices: AdminDevice[];
}
