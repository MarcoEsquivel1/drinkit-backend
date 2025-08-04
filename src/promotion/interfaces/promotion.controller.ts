import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { PromotionService } from '../use-cases/promotion.service';
import { CredentialsGuard } from '../../admin/infrastructure/auth/guards';

@ApiTags('Promotions')
@ApiSecurity('admnpomtkn')
@ApiSecurity('api-key')
@UseGuards(CredentialsGuard)
@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}
}
