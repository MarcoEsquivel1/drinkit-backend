import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginatedDto } from '../utils/paginated.util';

export class ResponseDto<T = any> {
  @ApiProperty({ description: 'Indica si la operación fue exitosa' })
  @Expose()
  success: boolean;

  @ApiProperty({ description: 'Contenido de la respuesta', required: false })
  @Expose()
  result?: T;

  @ApiProperty({ description: 'Mensaje de la respuesta' })
  @Expose()
  message: string;

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
  static success<T>(data: T, message = 'Operación exitosa'): ResponseDto<T> {
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
  ): ResponseDto<T> {
    return {
      success: true,
      result: data,
      message,
      pagination,
    };
  }

  static error(message = 'Error en la operación'): ResponseDto {
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
      result: this.success(data, message),
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
      result: this.successWithPagination(data, pagination, message),
    };
  }

  static innerError(
    status = 400,
    message = 'Error en la operación',
  ): InnerResponseDto {
    return {
      status,
      result: this.error(message),
    };
  }
}
