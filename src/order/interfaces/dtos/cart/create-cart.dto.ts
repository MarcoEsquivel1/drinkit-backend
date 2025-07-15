import { IsInt, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  @IsNotEmpty()
  fk_userId: number;

  @IsOptional()
  @IsDateString()
  deactivatedAt?: Date;
}
