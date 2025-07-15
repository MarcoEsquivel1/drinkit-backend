import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfiguration } from '../../config/mongodb.config';
import { mongoValidationSchema } from '../../config/mongodb-validation.config';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { AuditLogService } from './services/audit-log.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: false,
      load: [mongoConfiguration],
      validationSchema: mongoValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const username = config.get('MONGO_USERNAME');
        const password = config.get('MONGO_PASSWORD');
        const database = config.get('MONGO_DATABASE');
        const host = config.get('MONGO_HOST');
        const port = config.get('MONGO_PORT');
        return {
          uri: `mongodb://${username}:${password}@${host}:${port}`,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  providers: [AuditLogService],
  exports: [MongooseModule, AuditLogService],
})
export class AuditModule {}
