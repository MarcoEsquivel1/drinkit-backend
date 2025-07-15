export class AuditLogDto {
  action: string;
  tableName: string;
  timestamp: Date;
  entityId?: string;
  older?: object;
  newest?: object;
  updatedColumns?: object;
  updatedRelations?: object;
  description: string;
  creator: string;
}
