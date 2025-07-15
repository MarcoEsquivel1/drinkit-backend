import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { EncryptionService } from '../../../../shared/infrastructure/services/encryption.service';

@Injectable()
export class AdminSubscriber implements EntitySubscriberInterface<Admin> {
  private readonly logger: Logger = new Logger(AdminSubscriber.name);

  constructor(
    @InjectDataSource() readonly connection: DataSource,
    private readonly encryptionService: EncryptionService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo(): typeof Admin {
    return Admin;
  }

  beforeInsert(event: InsertEvent<Admin>): void {
    if (event.entity.password) {
      event.entity.password = this.encryptionService.encryptPasswd(
        event.entity.password,
      );
    }
    this.logger.verbose(`BEFORE ADMIN ENTITY INSERTED: ${event.entity.email}`);
  }

  beforeUpdate(event: UpdateEvent<Admin>): void {
    if (
      event.entity &&
      (event.updatedColumns.find((col) => col.propertyName === 'password') ||
        (event.entity.password && !event.entity.password.startsWith('$2b$')))
    ) {
      event.entity.password = this.encryptionService.encryptPasswd(
        event.entity.password,
      );
    }
    if (event.entity) {
      this.logger.verbose(`BEFORE ADMIN ENTITY UPDATED: ${event.entity.email}`);
    }
  }
}
