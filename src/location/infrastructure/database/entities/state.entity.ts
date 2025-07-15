import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import {
  IsString,
  IsInt,
  IsPositive,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { AuditedWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';
import { Country } from './country.entity';
import { City } from './city.entity';

@Entity('states')
export class State extends AuditedWithIdEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Nombre del estado/provincia', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  @Expose()
  name: string;

  @Column({ type: 'int', nullable: false, name: 'country_id' })
  @ApiProperty({ description: 'ID del país al que pertenece el estado' })
  @IsInt()
  @IsPositive()
  @Expose()
  countryId: number;

  @ManyToOne(() => Country, (country) => country.states)
  @JoinColumn({ name: 'country_id' })
  @ApiProperty({
    description: 'País al que pertenece el estado',
    type: () => Country,
  })
  country: Country;

  @OneToMany(() => City, (city) => city.state)
  @ApiProperty({ description: 'Ciudades del estado', type: () => [City] })
  cities: City[];

  usersAddresses: any[];
  usersRequests: any[];
}
