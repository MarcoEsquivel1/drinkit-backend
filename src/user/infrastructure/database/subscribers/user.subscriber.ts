import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { EncryptionService } from '../../../../shared/infrastructure/services/encryption.service';

@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  private readonly logger: Logger = new Logger(UserSubscriber.name);

  constructor(
    @InjectDataSource() readonly connection: DataSource,
    private readonly encryptionService: EncryptionService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo(): typeof User {
    return User;
  }

  beforeInsert(event: InsertEvent<User>): void {
    if (event.entity.password) {
      event.entity.password = this.encryptionService.encryptPasswd(
        event.entity.password,
      );
    }
    this.logger.verbose(`BEFORE USER ENTITY INSERTED: ${event.entity.email}`);
  }

  beforeUpdate(event: UpdateEvent<User>): void {
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
      this.logger.verbose(`BEFORE USER ENTITY UPDATED: ${event.entity.email}`);
    }
  }
}
