import { DataSource } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { City } from '../../../../location/infrastructure/database/entities/city.entity';

export default class CitiesSeeder extends Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const cityRepository = dataSource.getRepository(City);

    const cities = [
      {
        name: 'Ahuachapán',
        stateId: 1,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Apaneca',
        stateId: 1,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Atiquizaya',
        stateId: 1,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Sensuntepeque',
        stateId: 2,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Ilobasco',
        stateId: 2,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Chalatenango',
        stateId: 3,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'La Palma',
        stateId: 3,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Cojutepeque',
        stateId: 4,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Nueva Santa Rosa',
        stateId: 5,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Antiguo Cuscatlán',
        stateId: 5,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Zacatecoluca',
        stateId: 6,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'La Unión',
        stateId: 7,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Conchagua',
        stateId: 7,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'San Francisco Gotera',
        stateId: 8,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'San Miguel',
        stateId: 9,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Ciudad Barrios',
        stateId: 9,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'San Salvador',
        stateId: 10,
        shipping: 3.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Mejicanos',
        stateId: 10,
        shipping: 3.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Soyapango',
        stateId: 10,
        shipping: 3.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'San Vicente',
        stateId: 11,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Santa Ana',
        stateId: 12,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Metapán',
        stateId: 12,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Sonsonate',
        stateId: 13,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Acajutla',
        stateId: 13,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Usulután',
        stateId: 14,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Santiago de María',
        stateId: 14,
        shipping: 4.0,
        createdBy: '1',
        updatedBy: '1',
      },
    ];

    await cityRepository.save(cities);
  }
}
