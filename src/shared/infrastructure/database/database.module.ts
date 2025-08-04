import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getDatabaseConfig } from '../config/database.config';
import { DatabaseLogger } from './database.logger';
import { AuditModule } from './audit/audit.module';
import { TransactionProvider } from './providers/transaction.provider';
import { SubscriberControlService } from './services/subscriber-control.service';
import { EncryptionService } from '../services/encryption.service';
import { GlobalSubscriber } from './subscribers/global.subscriber';
import { UserSubscriber } from '../../../user/infrastructure/database/subscribers/user.subscriber';
import { AdminSubscriber } from '../../../admin/infrastructure/database/subscribers/admin.subscriber';

const services = [SubscriberControlService, EncryptionService];
const providers = [
  TransactionProvider,
  GlobalSubscriber,
  UserSubscriber,
  AdminSubscriber,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: false,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        ...getDatabaseConfig(configService),
        retryAttempts: 2,
        subscribers: [
          `${__dirname}/**/subscribers/**/*.subscriber{.ts,.js}`,
          `${__dirname}/../../../**/infrastructure/database/subscribers/**/*.subscriber{.ts,.js}`,
        ],
        logger: new DatabaseLogger(),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AuditModule,
  ],
  providers: [...services, ...providers],
  exports: [...services, TransactionProvider],
})
export class DatabaseModule {}
