import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

abstract class BaseEntity {
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
    comment: 'Date of creation.',
  })
  createdAt: Date;

  @Column({
    name: 'created_by',
    update: false,
    comment: 'Info of the creator.',
  })
  createdBy!: string;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    insert: false,
    comment: 'Date of last update.',
  })
  updatedAt?: Date;

  @Column({
    name: 'updated_by',
    nullable: true,
    insert: false,
    comment: 'Info of the last updater.',
  })
  updatedBy?: string;
}

export abstract class AuditedEntity extends BaseEntity {}

export abstract class AuditedWithIdEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'integer',
    comment: 'ID of the entity.',
  })
  id: number;
}

export abstract class AuditedWithUuidEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { comment: 'ID of the entity.' })
  id: string;
}

export abstract class SimpleAuditedWithIdEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'integer',
    comment: 'ID of the entity.',
  })
  id: number;

  @Column({ nullable: false, comment: 'Field for the name.' })
  name!: string;
}

export abstract class SimpleAuditedWithUuidEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { comment: 'ID of the entity.' })
  id: string;

  @Column({ nullable: false, comment: 'Field for the name.' })
  name!: string;
}
