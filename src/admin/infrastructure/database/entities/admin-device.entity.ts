import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AuditedWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';
import { Admin } from './admin.entity';

@Entity('admin_devices')
export class AdminDevice extends AuditedWithIdEntity {
  @Column({
    type: 'varchar',
    nullable: true,
    comment: 'Push token of the device',
  })
  token?: string;

  @Column({ type: 'varchar', nullable: true, comment: 'UUID of the device' })
  uuid?: string;

  @Column({ type: 'uuid', name: 'fk_admin_id' })
  adminId: string;

  @ManyToOne(() => Admin, (admin) => admin.devices)
  @JoinColumn({ name: 'fk_admin_id' })
  admin: Admin;
}
