import { Controller } from '@nestjs/common';
import { PromotionService } from '../use-cases/promotion.service';

@Controller()
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}
}
