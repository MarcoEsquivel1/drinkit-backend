import { DataSource } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { Role } from '../../../../user/infrastructure/database/entities/role.entity';

export default class RolesSeeder extends Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);

    const roles = [
      {
        rolesId: 1,
        name: 'root',
        createdBy: 1,
        updatedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        rolesId: 2,
        name: 'admin',
        createdBy: 1,
        updatedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        rolesId: 3,
        name: 'user',
        createdBy: 1,
        updatedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await roleRepository.save(roles);
  }
}
