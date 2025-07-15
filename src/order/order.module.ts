import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Order,
  OrderDetail,
  OrderHistory,
  OrderDetailHistory,
  PurchaseStatus,
  Cart,
  CartItem,
} from './infrastructure/database/entities';
import { OrderController } from './interfaces/order.controller';
import { OrderService } from './use-cases/order.service';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
      OrderHistory,
      OrderDetailHistory,
      PurchaseStatus,
      Cart,
      CartItem,
    ]),
    UserModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [TypeOrmModule, OrderService],
})
export class OrderModule {}
