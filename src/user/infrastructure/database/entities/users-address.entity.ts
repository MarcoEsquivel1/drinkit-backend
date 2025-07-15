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

@Entity('usersAddresses')
export class UsersAddress {
  @PrimaryGeneratedColumn()
  usersAddressesId: number;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'text', nullable: true })
  apartment: string;

  @Column({ type: 'text', nullable: true })
  referencePoint: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  label: string;

  @Column({ type: 'int', nullable: false })
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

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn({ name: 'fk_usersId' })
  user: User;

  @ManyToOne(() => Country, (country) => country.usersAddresses)
  @JoinColumn({ name: 'fk_countriesId' })
  country: Country;

  @ManyToOne(() => State, (state) => state.usersAddresses)
  @JoinColumn({ name: 'fk_statesId' })
  state: State;

  @ManyToOne(() => City, (city) => city.usersAddresses)
  @JoinColumn({ name: 'fk_citiesId' })
  city: City;
}
