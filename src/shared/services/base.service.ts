import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ResponseDto, ResponseBuilder } from '../dtos/response.dto';
import { handleError, createError } from '../utils/error.util';

@Injectable()
export class BaseService {
  protected readonly logger = new Logger(this.constructor.name);

  protected handleServiceError(error: unknown, context: string): never {
    const errorResult = handleError(error, this.logger, context);
    throw createError(errorResult.status, errorResult.result.message);
  }

  protected createSuccessResponse<T>(
    data: T,
    message = 'Operación exitosa',
  ): ResponseDto<T> {
    return ResponseBuilder.success(data, message);
  }

  protected createNotFoundError(entity: string, id: string): never {
    throw new NotFoundException(`${entity} con ID ${id} no encontrado`);
  }

  protected logInfo(message: string, data?: unknown): void {
    this.logger.log(message, data);
  }

  protected logWarning(message: string, data?: unknown): void {
    this.logger.warn(message, data);
  }

  protected logError(message: string, error?: unknown): void {
    this.logger.error(message, error);
  }
}
