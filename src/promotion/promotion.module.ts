import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Coupon,
  CouponUsage,
  Offer,
  Banner,
} from './infrastructure/database/entities';
import { PromotionController } from './interfaces/promotion.controller';
import { PromotionService } from './use-cases/promotion.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon, CouponUsage, Offer, Banner]),
    UserModule,
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [TypeOrmModule, PromotionService],
})
export class PromotionModule {}
