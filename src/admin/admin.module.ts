import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './interfaces/admin.controller';
import { AdminService } from './use-cases/admin.service';
import { Admin, AdminDevice } from './infrastructure/database/entities';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, AdminDevice]), AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService, AuthModule],
})
export class AdminModule {}
