import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  User,
  Role,
  UsersAddress,
  UsersDevice,
  UsersFavorite,
  UsersInvoice,
  UsersRequest,
  UsersTransaction,
} from '../infrastructure/database/entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UsersAddress)
    private usersAddressRepository: Repository<UsersAddress>,
    @InjectRepository(UsersDevice)
    private usersDeviceRepository: Repository<UsersDevice>,
    @InjectRepository(UsersFavorite)
    private usersFavoriteRepository: Repository<UsersFavorite>,
    @InjectRepository(UsersInvoice)
    private usersInvoiceRepository: Repository<UsersInvoice>,
    @InjectRepository(UsersRequest)
    private usersRequestRepository: Repository<UsersRequest>,
    @InjectRepository(UsersTransaction)
    private usersTransactionRepository: Repository<UsersTransaction>,
  ) {}
}
