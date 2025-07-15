import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    comment: 'Date of deletion.',
  })
  deletedAt?: Date;
}

export abstract class ParanoidEntity extends BaseEntity {}

export abstract class ParanoidWithIdEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'integer',
    comment: 'ID of the entity.',
  })
  id: number;

  @Column({
    name: 'deleted_by',
    nullable: true,
    insert: false,
    comment: 'Info of the deleter.',
  })
  deletedBy?: string;
}

export abstract class ParanoidWithUuidEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { comment: 'ID of the entity.' })
  id: string;

  @Column({
    name: 'deleted_by',
    nullable: true,
    insert: false,
    comment: 'Info of the deleter.',
  })
  deletedBy?: string;
}
