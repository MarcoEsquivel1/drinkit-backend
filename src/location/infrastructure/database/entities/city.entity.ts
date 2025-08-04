import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import {
  IsString,
  IsNumber,
  IsInt,
  IsPositive,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { AuditedWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';
import { State } from './state.entity';
import { UsersAddress } from '../../../../user/infrastructure/database/entities/users-address.entity';
import { UsersRequest } from '../../../../user/infrastructure/database/entities/users-request.entity';

@Entity('cities')
export class City extends AuditedWithIdEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Nombre de la ciudad', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  @Expose()
  name: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
    default: 4,
  })
  @ApiProperty({
    description: 'Costo de envío para la ciudad',
    default: 4,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Expose()
  shipping: number;

  @Column({ type: 'int', nullable: false, name: 'state_id' })
  @ApiProperty({ description: 'ID del estado al que pertenece la ciudad' })
  @IsInt()
  @IsPositive()
  @Expose()
  stateId: number;

  @ManyToOne(() => State, (state) => state.cities)
  @JoinColumn({ name: 'state_id' })
  @ApiProperty({
    description: 'Estado al que pertenece la ciudad',
    type: () => State,
  })
  state: State;

  usersAddresses: UsersAddress[];
  usersRequests: UsersRequest[];
}
