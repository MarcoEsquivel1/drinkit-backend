import { IsString, IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({ description: 'ID del usuario propietario del carrito' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID del producto a agregar al carrito' })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  productId: number;

  @ApiProperty({ description: 'Cantidad del producto', minimum: 1 })
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}
