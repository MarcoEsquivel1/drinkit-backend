import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  IsBoolean,
  IsIn,
  IsArray,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reference: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ])
  orderStatus: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  confirmation?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['CASH', 'CARD', 'PUNTO_XPRESS', 'CREDIT'])
  paymentType: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
  paymentStatus: string;

  @IsNumber()
  @Min(0)
  total: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  apartment?: string;

  @IsString()
  @IsOptional()
  referencePoint?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  state?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  shipping?: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  balance?: number;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsInt()
  @IsNotEmpty()
  fk_userId: number;

  @IsInt()
  @IsNotEmpty()
  createdBy: number;

  @IsInt()
  @IsOptional()
  updatedBy?: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  coupon?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  eta?: string;

  @IsString()
  @IsOptional()
  @IsIn(['app', 'web', 'admin'])
  source?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  perception?: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsOptional()
  loyalty?: any[];
}
