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
import { Country } from 'src/location/infrastructure/database/entities/country.entity';
import { State } from 'src/location/infrastructure/database/entities/state.entity';
import { City } from 'src/location/infrastructure/database/entities/city.entity';

@Entity('usersRequests')
export class UsersRequest {
  @PrimaryGeneratedColumn()
  usersRequestsId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  identifier: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  approved: boolean;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'int', nullable: true })
  fk_usersId: number;

  @Column({ type: 'int', nullable: true })
  fk_citiesId: number;

  @Column({ type: 'int', nullable: true })
  fk_statesId: number;

  @Column({ type: 'int', nullable: true })
  fk_countriesId: number;

  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @Column({ type: 'int', nullable: true })
  updatedBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.requests)
  @JoinColumn({ name: 'fk_usersId' })
  user: User;

  @ManyToOne(() => Country, (country) => country.usersRequests)
  @JoinColumn({ name: 'fk_countriesId' })
  country: Country;

  @ManyToOne(() => State, (state) => state.usersRequests)
  @JoinColumn({ name: 'fk_statesId' })
  state: State;

  @ManyToOne(() => City, (city) => city.usersRequests)
  @JoinColumn({ name: 'fk_citiesId' })
  city: City;
}
