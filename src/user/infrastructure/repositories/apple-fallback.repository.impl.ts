import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppleFallbackRepository } from '../../domain/repositories/apple-fallback.repository';
import { AppleFallback } from '../database/entities/apple-fallback.entity';

@Injectable()
export class AppleFallbackRepositoryImpl implements AppleFallbackRepository {
  constructor(
    @InjectRepository(AppleFallback)
    private readonly repository: Repository<AppleFallback>,
  ) {}

  async create(data: Partial<AppleFallback>): Promise<AppleFallback> {
    const appleFallback = this.repository.create(data);
    return this.repository.save(appleFallback);
  }

  async findById(id: number): Promise<AppleFallback | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByAppleId(appleId: string): Promise<AppleFallback | null> {
    return this.repository.findOne({ where: { appleId } });
  }

  async findAll(limit?: number): Promise<AppleFallback[]> {
    const query = this.repository.createQueryBuilder('fallback');
    if (limit) {
      query.take(limit);
    }
    return query.getMany();
  }

  async update(
    id: number,
    data: Partial<AppleFallback>,
  ): Promise<AppleFallback | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
