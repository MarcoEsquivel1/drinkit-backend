import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserGender } from '../enums';

abstract class BaseEntity {
  @Column({ type: 'varchar', unique: true, comment: 'email of the user' })
  email!: string;

  @Column({ type: 'varchar', comment: 'password of the user' })
  password!: string;

  @Column({ type: 'varchar', nullable: false, comment: 'name of the user' })
  name!: string;

  @Column({ type: 'varchar', nullable: false, comment: 'surname of the user' })
  surname!: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Flag indicating if the user is active',
  })
  enabled?: boolean;

  @Column({ type: 'varchar', nullable: true, comment: 'phone of the user' })
  phone?: string;

  @Column({ type: 'varchar', nullable: true, comment: 'photo of the user' })
  photo?: string;

  @Column({
    type: 'enum',
    enum: UserGender,
    default: UserGender.OTHER,
    comment: 'gender of the user',
  })
  gender: UserGender;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
    comment: 'Date of creation.',
  })
  createdAt: Date;

  @Column({
    type: 'varchar',
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
    type: 'varchar',
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

export abstract class BaseCustomerEntity {
  @PrimaryGeneratedColumn('uuid', { comment: 'Id of the entity.' })
  id: string;

  @Column({ type: 'varchar', unique: true, comment: 'email of the user' })
  email!: string;

  @Column({ type: 'varchar', comment: 'password of the user' })
  password!: string;

  @Column({ type: 'varchar', nullable: false, comment: 'name of the user' })
  name!: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Flag indicating if the user is active',
  })
  enabled?: boolean;

  @Column({ type: 'varchar', nullable: true, comment: 'phone of the user' })
  phone?: string;

  @Column({ type: 'varchar', nullable: true, comment: 'photo of the user' })
  photo?: string;

  @Column({
    type: 'enum',
    enum: UserGender,
    default: UserGender.OTHER,
    comment: 'gender of the user',
  })
  gender: UserGender;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
    comment: 'Date of creation.',
  })
  createdAt: Date;

  @Column({
    type: 'varchar',
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
    type: 'varchar',
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

  @Column({
    type: 'varchar',
    name: 'deleted_by',
    nullable: true,
    insert: false,
    comment: 'Info of the deleter.',
  })
  deletedBy?: string;
}

export abstract class BaseUserEntity extends BaseEntity {}

export abstract class BaseUserWithIdEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'integer',
    comment: 'Id of the entity.',
  })
  id: number;

  @Column({
    type: 'varchar',
    name: 'deleted_by',
    nullable: true,
    insert: false,
    comment: 'Info of the deleter.',
  })
  deletedBy?: string;
}

export abstract class BaseUserWithUuidEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { comment: 'Id of the entity.' })
  id: string;

  @Column({
    type: 'varchar',
    name: 'deleted_by',
    nullable: true,
    insert: false,
    comment: 'Info of the deleter.',
  })
  deletedBy?: string;
}
