import { IsInt, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCouponUsageDto {
  @IsInt()
  @IsNotEmpty()
  fk_couponsId: number;

  @IsInt()
  @IsNotEmpty()
  fk_usersId: number;

  @IsInt()
  @IsNotEmpty()
  createdBy: number;

  @IsInt()
  @IsOptional()
  updatedBy?: number;

  @IsBoolean()
  @IsOptional()
  alreadyUsed?: boolean;
}
