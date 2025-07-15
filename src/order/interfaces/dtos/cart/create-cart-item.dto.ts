import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @IsNotEmpty()
  fk_cartId: number;

  @IsInt()
  @IsNotEmpty()
  fk_productId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsDateString()
  deactivatedAt?: Date;
}
