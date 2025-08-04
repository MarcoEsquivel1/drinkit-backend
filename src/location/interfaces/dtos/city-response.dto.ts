import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CityResponseDto {
  @ApiProperty({ description: 'ID único de la ciudad' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nombre de la ciudad' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Costo de envío para la ciudad' })
  @Expose()
  shipping: number;

  @ApiProperty({ description: 'ID del estado al que pertenece' })
  @Expose()
  stateId: number;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @Expose()
  updatedAt: Date;
}
