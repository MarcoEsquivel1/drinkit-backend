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
    const { older, newest, updatedColumns } = record;

    const optimizedOlder: Record<string, any> = {};
    const optimizedNewest: Record<string, any> = {};

    updatedColumns?.forEach((column) => {
      if (older.hasOwnProperty(column)) {
        optimizedOlder[column] = older[column];
      }
      if (newest.hasOwnProperty(column)) {
        optimizedNewest[column] = newest[column];
      }
    });

    return {
      ...record,
      older: Object.keys(optimizedOlder).length > 0 ? optimizedOlder : older,
      newest:
        Object.keys(optimizedNewest).length > 0 ? optimizedNewest : newest,
    };
  }

  private createAuditLog(action: string, event: any): void {
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

      this.auditLogService.create(auditLogData);
    } catch (error) {
      this.logger.error(`Error creating audit log: ${error.message}`);
    }
  }

  afterInsert(event: InsertEvent<any>): void {
    this.logger.verbose(`AFTER ENTITY INSERTED: ${event.metadata.tableName}`);
    this.createAuditLog('insert', event);
  }

  afterUpdate(event: UpdateEvent<any>): void {
    this.logger.verbose(`AFTER ENTITY UPDATED: ${event.metadata.tableName}`);
    this.createAuditLog('update', event);
  }

  afterRemove(event: RemoveEvent<any>): void {
    this.logger.verbose(`AFTER ENTITY REMOVED: ${event.metadata.tableName}`);
    this.createAuditLog('remove', event);
  }

  afterSoftRemove(event: SoftRemoveEvent<any>): void {
    this.logger.verbose(
      `AFTER ENTITY SOFT REMOVED: ${event.metadata.tableName}`,
    );
    this.createAuditLog('soft-remove', event);
  }

  afterRecover(event: RecoverEvent<any>): void {
    this.logger.verbose(`AFTER ENTITY RECOVERED: ${event.metadata.tableName}`);
    this.createAuditLog('recover', event);
  }
}
