import { DataSource } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { State } from '../../../../location/infrastructure/database/entities/state.entity';

export default class StatesSeeder extends Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const stateRepository = dataSource.getRepository(State);

    const states = [
      {
        name: 'Ahuachapán',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Cabañas',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Chalatenango',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Cuscatlán',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'La Libertad',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'La Paz',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'La Unión',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Morazán',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'San Miguel',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'San Salvador',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'San Vicente',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Santa Ana',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Sonsonate',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
      {
        name: 'Usulután',
        countryId: 59,
        createdBy: '1',
        updatedBy: '1',
      },
    ];

    await stateRepository.save(states);
  }
}
