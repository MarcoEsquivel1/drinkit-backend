import { ApiResponseOptions } from '@nestjs/swagger';

export const createSuccessNullSchema = (message: string) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    result: { type: 'null', example: null },
    message: { type: 'string', example: message },
  },
});

export const createErrorSchemas = () => ({
  400: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Error en la solicitud' },
    },
  },
  401: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'No autorizado' },
    },
  },
  404: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Recurso no encontrado' },
    },
  },
  422: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Error de validación' },
    },
  },
  500: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Error interno del servidor' },
    },
  },
});

export const createSuccessResponseSchema = (
  resultType: string,
  message: string,
  isArray = false,
) => ({
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          result: isArray
            ? {
                type: 'array',
                items: { $ref: `#/components/schemas/${resultType}` },
              }
            : { $ref: `#/components/schemas/${resultType}` },
          message: { type: 'string', example: message },
        },
      },
    },
  },
});

export const createSuccessPaginatedResponseSchema = (
  resultType: string,
  message: string,
) => ({
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          result: {
            type: 'array',
            items: { $ref: `#/components/schemas/${resultType}` },
          },
          message: { type: 'string', example: message },
          pagination: {
            type: 'object',
            properties: {
              current: { type: 'number', example: 1 },
              pageSize: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 5 },
              count: { type: 'number', example: 50 },
            },
          },
        },
      },
    },
  },
});

export const createApiResponse = (
  status: number,
  description: string,
  resultType: string,
  message: string,
  isArray = false,
): ApiResponseOptions => ({
  status,
  description,
  ...createSuccessResponseSchema(resultType, message, isArray),
});

export const createApiResponsePaginated = (
  status: number,
  description: string,
  resultType: string,
  message: string,
): ApiResponseOptions => ({
  status,
  description,
  ...createSuccessPaginatedResponseSchema(resultType, message),
});

export const createAuthDecorators = () => ({
  admin: {
    security: ['@ApiSecurity("admnpomtkn")', '@ApiSecurity("api-key")'],
    response: {
      status: 401,
      description: 'No autorizado',
      schema: createErrorSchemas()[401],
    },
  },
  customer: {
    security: ['@ApiSecurity("custmrpomtkn")', '@ApiSecurity("api-key")'],
    response: {
      status: 401,
      description: 'No autorizado',
      schema: createErrorSchemas()[401],
    },
  },
});

export const createAuthErrorResponse = () => ({
  status: 401,
  description: 'No autorizado',
  schema: createErrorSchemas()[401],
});
