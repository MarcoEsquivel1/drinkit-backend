/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  RecoverEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditLogService } from '../audit/services/audit-log.service';
import { AuditLogDto } from '../audit/dtos/audit-log.dto';

@Injectable()
export class GlobalSubscriber implements EntitySubscriberInterface<any> {
  private readonly logger: Logger = new Logger(GlobalSubscriber.name);

  constructor(
    @InjectDataSource() readonly connection: DataSource,
    private readonly auditLogService: AuditLogService,
  ) {
    connection.subscribers.push(this);
  }

  private optimizeRecord(record: any): any {
    const { older, newest, updatedColumns } = record as {
      older: Record<string, any>;
      newest: Record<string, any>;
      updatedColumns: string[];
    };

    const optimizedOlder: Record<string, any> = {};
    const optimizedNewest: Record<string, any> = {};

    updatedColumns?.forEach((column) => {
      if (Object.prototype.hasOwnProperty.call(older, column)) {
        optimizedOlder[column] = older[column] as unknown;
      }
      if (Object.prototype.hasOwnProperty.call(newest, column)) {
        optimizedNewest[column] = newest[column] as unknown;
      }
    });

    return {
      ...record,
      older: Object.keys(optimizedOlder).length > 0 ? optimizedOlder : older,
      newest:
        Object.keys(optimizedNewest).length > 0 ? optimizedNewest : newest,
    };
  }

  private async createAuditLog(action: string, event: any): Promise<void> {
    try {
      const date = new Date();
      let auditLogData: Partial<AuditLogDto> = {
        action,
        tableName: event?.metadata?.tableName,
        timestamp: date,
        entityId: event?.entityId,
        older: event?.databaseEntity,
        newest: event?.entity,
        updatedColumns: event?.updatedColumns?.map((col) => col.propertyName),
        updatedRelations: event?.updatedRelations?.map(
          (col) => col.propertyName,
        ),
        description: `Record in ${event?.metadata?.tableName} was ${
          action.slice(-1) == 'e' ? `${action}d` : `${action}ed`
        }`,
        creator: event.entity?.createdBy ?? event.entity?.updatedBy ?? 'N/A',
      };

      if (action === 'update') {
        auditLogData = this.optimizeRecord(auditLogData);
      }

      await this.auditLogService.create(auditLogData);
    } catch (error) {
      this.logger.error(`Error creating audit log: ${error.message}`);
    }
  }

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    this.logger.verbose(`AFTER ENTITY INSERTED: ${event.metadata.tableName}`);
    await this.createAuditLog('insert', event);
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    this.logger.verbose(`AFTER ENTITY UPDATED: ${event.metadata.tableName}`);
    await this.createAuditLog('update', event);
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    this.logger.verbose(`AFTER ENTITY REMOVED: ${event.metadata.tableName}`);
    await this.createAuditLog('remove', event);
  }

  async afterSoftRemove(event: SoftRemoveEvent<any>): Promise<void> {
    this.logger.verbose(
      `AFTER ENTITY SOFT REMOVED: ${event.metadata.tableName}`,
    );
    await this.createAuditLog('soft-remove', event);
  }

  async afterRecover(event: RecoverEvent<any>): Promise<void> {
    this.logger.verbose(`AFTER ENTITY RECOVERED: ${event.metadata.tableName}`);
    await this.createAuditLog('recover', event);
  }
}
