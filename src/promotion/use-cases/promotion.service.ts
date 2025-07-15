import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Coupon,
  CouponUsage,
  Offer,
  Banner,
} from '../infrastructure/database/entities';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(CouponUsage)
    private couponUsageRepository: Repository<CouponUsage>,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
  ) {}
}
