import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlacklistRepository } from '../../domain/repositories/blacklist.repository';
import { Blacklist } from '../database/entities/blacklist.entity';

@Injectable()
export class BlacklistRepositoryImpl implements BlacklistRepository {
  constructor(
    @InjectRepository(Blacklist)
    private readonly repository: Repository<Blacklist>,
  ) {}

  async create(data: Partial<Blacklist>): Promise<Blacklist> {
    const blacklistItem = this.repository.create(data);
    return this.repository.save(blacklistItem);
  }

  async findByEmail(email: string): Promise<Blacklist | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findAll(): Promise<Blacklist[]> {
    return this.repository.find();
  }

  async getAllEmails(): Promise<string[]> {
    const blacklistItems = await this.repository.find({
      select: ['email'],
    });
    return blacklistItems
      .map((item) => item.email)
      .filter((email) => email != null);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
