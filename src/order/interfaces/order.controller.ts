import { Controller } from '@nestjs/common';
import { OrderService } from '../use-cases/order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
}
