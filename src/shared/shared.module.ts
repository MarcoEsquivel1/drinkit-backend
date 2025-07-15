import { Module, Global } from '@nestjs/common';
import { LoggerService } from './infrastructure/logger.service';
import { EncryptionService } from './infrastructure/services/encryption.service';

@Global()
@Module({
  providers: [LoggerService, EncryptionService],
  exports: [LoggerService, EncryptionService],
})
export class SharedModule {}
