import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Admin } from '../../infrastructure/database/entities/admin.entity';
import { User } from '../../../user/infrastructure/database/entities/user.entity';
import { AuthenticationData } from '../../infrastructure/auth/interfaces';

@Injectable()
export class VerifyAccessEvent {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async check(adminId: string): Promise<AuthenticationData | null> {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId, deletedAt: IsNull() },
      relations: ['role'],
    });

    if (!admin) {
      return null;
    }

    return {
      id: admin.id,
      photo: admin.photo || '',
      name: admin.name || '',
      surname: admin.surname || '',
      enabled: admin.enabled || false,
      isLoggedIn: admin.isLoggedIn || false,
      role: {
        id: admin.role?.rolesId || 0,
        name: admin.role?.name || '',
      },
    };
  }

  async checkCustomer(customerId: string): Promise<AuthenticationData | null> {
    const customer = await this.userRepository.findOne({
      where: { id: customerId, deletedAt: IsNull() },
      relations: ['role'],
    });

    if (!customer) {
      return null;
    }

    return {
      id: customer.id,
      photo: customer.photo || '',
      name: customer.name || '',
      surname: '',
      enabled: customer.enabled || false,
      isLoggedIn: customer.isLoggedIn || false,
      role: {
        id: customer.role?.rolesId || 0,
        name: customer.role?.name || '',
      },
    };
  }
}
