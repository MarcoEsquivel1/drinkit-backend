import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreatePurchaseStatusDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsInt()
  @IsNotEmpty()
  createdBy: number;

  @IsInt()
  @IsOptional()
  updatedBy?: number;
}
