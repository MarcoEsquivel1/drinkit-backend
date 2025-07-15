import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Order,
  OrderDetail,
  OrderHistory,
  OrderDetailHistory,
  PurchaseStatus,
  Cart,
  CartItem,
} from '../infrastructure/database/entities';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(OrderHistory)
    private orderHistoryRepository: Repository<OrderHistory>,
    @InjectRepository(OrderDetailHistory)
    private orderDetailHistoryRepository: Repository<OrderDetailHistory>,
    @InjectRepository(PurchaseStatus)
    private purchaseStatusRepository: Repository<PurchaseStatus>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}
}
