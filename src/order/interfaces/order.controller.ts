import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { OrderService } from '../use-cases/order.service';
import { SecureCustomerGuard } from '../../admin/infrastructure/auth/guards';

@ApiTags('Orders')
@ApiSecurity('custmrpomtkn')
@ApiSecurity('api-key')
@UseGuards(SecureCustomerGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
}
