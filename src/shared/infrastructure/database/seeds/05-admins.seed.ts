import { DataSource } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { Admin } from '../../../../admin/infrastructure/database/entities/admin.entity';
import { UserGender } from '../../../../shared/infrastructure/database/entities/enums';

export default class AdminsSeeder extends Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const adminRepository = dataSource.getRepository(Admin);

    const admins = [
      {
        email: 'root.tuyo@yopmail.com',
        password:
          '$2b$15$pQnYooYT3Eu.72yGzrbFcep0e2Ekhww5M082ICoRJ3iGEEYIBnrN2',
        name: 'Root',
        surname: 'User',
        enabled: true,
        phone: '77777777',
        photo: 'https://www.placecage.com/220/220',
        gender: UserGender.MALE,
        roleId: 1,
        createdBy: '1',
        updatedBy: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'admin.tuyo@yopmail.com',
        password:
          '$2b$15$pQnYooYT3Eu.72yGzrbFcep0e2Ekhww5M082ICoRJ3iGEEYIBnrN2',
        name: 'Admin',
        surname: 'User',
        enabled: true,
        phone: '77777778',
        photo: 'https://www.placecage.com/220/220',
        gender: UserGender.MALE,
        roleId: 2,
        createdBy: '1',
        updatedBy: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await adminRepository.save(admins);
  }
}
