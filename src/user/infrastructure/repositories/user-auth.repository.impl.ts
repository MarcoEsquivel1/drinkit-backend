import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuthRepository } from '../../domain/repositories/user-auth.repository';
import { User } from '../database/entities/user.entity';

@Injectable()
export class UserAuthRepositoryImpl implements UserAuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findByCredentials(
    username?: string,
    email?: string,
  ): Promise<User | null> {
    const whereCondition = email ? { email } : { username };
    return this.repository.findOne({
      where: whereCondition,
      relations: ['role'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async findBySocialId(
    socialId: string,
    provider: 'google' | 'facebook' | 'apple',
  ): Promise<User | null> {
    const whereCondition = {
      [`${provider}Id`]: socialId,
    };
    return this.repository.findOne({
      where: whereCondition,
      relations: ['role'],
    });
  }

  async findByEmailOrSocialId(
    email: string,
    socialId: string,
    provider: 'google' | 'facebook' | 'apple',
  ): Promise<User | null> {
    const socialField = `${provider}Id`;
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email OR user.' + socialField + ' = :socialId', {
        email,
        socialId,
      })
      .getOne();
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async updateLoginStatus(userId: number, isLoggedIn: boolean): Promise<void> {
    await this.repository.update(userId, { isLoggedIn });
  }

  async updateVerificationStatus(
    email: string,
    isVerified: boolean,
  ): Promise<void> {
    await this.repository.update({ email }, { verify: isVerified });
  }

  async linkSocialAccount(
    userId: number,
    socialId: string,
    provider: 'google' | 'facebook' | 'apple',
  ): Promise<void> {
    const updateData = {
      [`${provider}Id`]: socialId,
    };
    await this.repository.update(userId, updateData);
  }

  async unlinkSocialAccount(
    userId: number,
    provider: 'google' | 'facebook' | 'apple',
  ): Promise<void> {
    const updateData = {
      [`${provider}Id`]: null,
    };
    await this.repository.update(userId, updateData);
  }

  async updateSocialAccountData(userId: number, email?: string): Promise<void> {
    if (email) {
      await this.repository.update(userId, { email });
    }
  }
}
