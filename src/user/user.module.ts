import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Role,
  UsersAddress,
  UsersDevice,
  UsersFavorite,
  UsersInvoice,
  UsersRequest,
  UsersTransaction,
} from './infrastructure/database/entities';
import { UserController } from './interfaces/user.controller';
import { UserService } from './use-cases/user.service';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      UsersAddress,
      UsersDevice,
      UsersFavorite,
      UsersInvoice,
      UsersRequest,
      UsersTransaction,
    ]),
    LocationModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
