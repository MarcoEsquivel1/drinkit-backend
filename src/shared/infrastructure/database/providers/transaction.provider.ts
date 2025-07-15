import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class TransactionProvider {
  constructor(private readonly datasource: DataSource) {}

  async transaction<T>(
    callback: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return await this.datasource.transaction(async (manager: EntityManager) => {
      return callback(manager);
    });
  }
}
