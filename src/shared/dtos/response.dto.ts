import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginatedDto } from '../utils/paginated.util';

// DTO base para respuestas simples (sin paginación)
export class SimpleResponseDto<T = any> {
  @ApiProperty({ description: 'Indica si la operación fue exitosa' })
  @Expose()
  success: boolean;

  @ApiProperty({ description: 'Contenido de la respuesta', required: false })
  @Expose()
  result?: T;

  @ApiProperty({ description: 'Mensaje de la respuesta' })
  @Expose()
  message: string;
}

// DTO para respuestas con paginación
export class PaginatedResponseDto<T = any> {
  @ApiProperty({ description: 'Indica si la operación fue exitosa' })
  @Expose()
  success: boolean;

  @ApiProperty({ description: 'Contenido de la respuesta', required: false })
  @Expose()
  result?: T;

  @ApiProperty({ description: 'Mensaje de la respuesta' })
  @Expose()
  message: string;

  @ApiProperty({ description: 'Datos de la paginación' })
  @Expose()
  @Type(() => PaginatedDto)
  pagination: PaginatedDto;
}

// DTO original para mantener compatibilidad
export class ResponseDto<T = any> extends SimpleResponseDto<T> {
  @ApiProperty({ description: 'Datos de la paginación', required: false })
  @Expose()
  @Type(() => PaginatedDto)
  pagination?: PaginatedDto;
}

export class InnerResponseDto<T = any> {
  @ApiProperty({ description: 'Status de la respuesta' })
  @Expose()
  status: number;

  @ApiProperty({ description: 'Contenido de la respuesta' })
  @Expose()
  @Type(() => ResponseDto<T>)
  result: ResponseDto<T>;
}

export class ResponseBuilder {
  static success<T>(
    data: T,
    message = 'Operación exitosa',
  ): SimpleResponseDto<T> {
    return {
      success: true,
      result: data,
      message,
    };
  }

  static successWithPagination<T>(
    data: T,
    pagination: PaginatedDto,
    message = 'Operación exitosa',
  ): PaginatedResponseDto<T> {
    return {
      success: true,
      result: data,
      message,
      pagination,
    };
  }

  static error(message = 'Error en la operación'): SimpleResponseDto {
    return {
      success: false,
      message,
    };
  }

  static innerSuccess<T>(
    data: T,
    status = 200,
    message = 'Operación exitosa',
  ): InnerResponseDto<T> {
    return {
      status,
      result: this.success(data, message) as ResponseDto<T>,
    };
  }

  static innerSuccessWithPagination<T>(
    data: T,
    pagination: PaginatedDto,
    status = 200,
    message = 'Operación exitosa',
  ): InnerResponseDto<T> {
    return {
      status,
      result: this.successWithPagination(
        data,
        pagination,
        message,
      ) as ResponseDto<T>,
    };
  }

  static innerError(
    status = 400,
    message = 'Error en la operación',
  ): InnerResponseDto {
    return {
      status,
      result: this.error(message) as ResponseDto,
    };
  }
}
