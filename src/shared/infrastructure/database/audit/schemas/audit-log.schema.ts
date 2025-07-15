import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema()
export class AuditLog {
  @Prop()
  action: string;

  @Prop()
  tableName: string;

  @Prop()
  timestamp: Date;

  @Prop()
  entityId?: string;

  @Prop({ type: 'Object' })
  older?: object;

  @Prop({ type: 'Object' })
  newest?: object;

  @Prop({ type: 'Object' })
  updatedColumns?: object;

  @Prop({ type: 'Object' })
  updatedRelations?: object;

  @Prop()
  description: string;

  @Prop()
  creator: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
