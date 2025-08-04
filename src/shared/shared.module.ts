import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ResponseInterceptor } from './infrastructure/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './infrastructure/filters/error.filter';
import { BaseService } from './services/base.service';
import { LoggerService } from './infrastructure/logger.service';
import { EncryptionService } from './infrastructure/services/encryption.service';

@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    BaseService,
    LoggerService,
    EncryptionService,
  ],
  exports: [BaseService, LoggerService, EncryptionService],
})
export class SharedModule {}
