import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseStatusDto } from './create-purchase-status.dto';

export class UpdatePurchaseStatusDto extends PartialType(
  CreatePurchaseStatusDto,
) {}
