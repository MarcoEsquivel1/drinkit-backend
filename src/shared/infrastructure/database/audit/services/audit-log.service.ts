import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from '../schemas/audit-log.schema';
import { AuditLogDto } from '../dtos/audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async create(auditLogDto: Partial<AuditLogDto>): Promise<AuditLog> {
    const createdAuditLog = new this.auditLogModel(auditLogDto);
    return createdAuditLog.save();
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogModel.find().exec();
  }

  async findByTableName(tableName: string): Promise<AuditLog[]> {
    return this.auditLogModel.find({ tableName }).exec();
  }

  async findByEntityId(entityId: string): Promise<AuditLog[]> {
    return this.auditLogModel.find({ entityId }).exec();
  }
}
