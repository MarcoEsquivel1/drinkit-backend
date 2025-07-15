import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SecureCustomerGuard extends AuthGuard('secure-customer') {}
