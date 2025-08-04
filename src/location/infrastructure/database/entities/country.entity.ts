import { Entity, Column, OneToMany } from 'typeorm';
import {
  IsString,
  IsOptional,
  Length,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { AuditedWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';
import { State } from './state.entity';
import { UsersAddress } from '../../../../user/infrastructure/database/entities/users-address.entity';
import { UsersRequest } from '../../../../user/infrastructure/database/entities/users-request.entity';

@Entity('countries')
export class Country extends AuditedWithIdEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Nombre del país', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  @Expose()
  name: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  @ApiPropertyOptional({ description: 'Código ISO2 del país', maxLength: 2 })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  @Matches(/^[A-Z]{2}$/, { message: 'ISO2 debe ser 2 letras mayúsculas' })
  @Transform(
    ({ value }) =>
      (typeof value === 'string' ? value.toUpperCase() : value) as string,
  )
  @Expose()
  iso2?: string;

  @Column({ type: 'varchar', length: 3, nullable: true })
  @ApiPropertyOptional({ description: 'Código ISO3 del país', maxLength: 3 })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/, { message: 'ISO3 debe ser 3 letras mayúsculas' })
  @Transform(
    ({ value }) =>
      (typeof value === 'string' ? value.toUpperCase() : value) as string,
  )
  @Expose()
  iso3?: string;

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'phone_code' })
  @ApiPropertyOptional({
    description: 'Código telefónico del país',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Matches(/^\+?\d+$/, {
    message:
      'Código telefónico debe contener solo números y puede empezar con +',
  })
  @Expose()
  phoneCode?: string;

  @OneToMany(() => State, (state) => state.country)
  @ApiProperty({
    description: 'Estados/provincias del país',
    type: () => [State],
  })
  states: State[];

  usersAddresses: UsersAddress[];
  usersRequests: UsersRequest[];
}
