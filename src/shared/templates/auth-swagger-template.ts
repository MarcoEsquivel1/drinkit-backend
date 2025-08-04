/**
 * Template para aplicar autenticación en controladores Swagger
 *
 * Para endpoints que requieren autenticación de ADMIN:
 * 1. Agregar @ApiSecurity('admnpomtkn')
 * 2. Agregar @ApiSecurity('api-key')
 * 3. Agregar @ApiResponse para 401
 *
 * Para endpoints que requieren autenticación de CUSTOMER:
 * 1. Agregar @ApiSecurity('custmrpomtkn')
 * 2. Agregar @ApiSecurity('api-key')
 * 3. Agregar @ApiResponse para 401
 */

// Ejemplo para endpoint de Admin:
/*
@Post()
@UseGuards(CredentialsGuard)
@ApiSecurity('admnpomtkn')
@ApiSecurity('api-key')
@ApiOperation({ summary: 'Crear recurso' })
@ApiResponse({
  status: 201,
  description: 'Recurso creado exitosamente',
  type: SingleResponseDto,
})
@ApiResponse({
  status: 401,
  description: 'No autorizado',
  schema: createErrorSchemas()[401],
})
*/

// Ejemplo para endpoint de Customer:
/*
@Get()
@UseGuards(SecureCustomerGuard)
@ApiSecurity('custmrpomtkn')
@ApiSecurity('api-key')
@ApiOperation({ summary: 'Obtener recursos' })
@ApiResponse({
  status: 200,
  description: 'Recursos obtenidos exitosamente',
  type: CollectionResponseDto,
})
@ApiResponse({
  status: 401,
  description: 'No autorizado',
  schema: createErrorSchemas()[401],
})
*/

export const SWAGGER_AUTH_TEMPLATE = {
  admin: {
    decorators: ['@ApiSecurity("admnpomtkn")', '@ApiSecurity("api-key")'],
    response401: {
      status: 401,
      description: 'No autorizado - Requiere autenticación de administrador',
    },
  },
  customer: {
    decorators: ['@ApiSecurity("custmrpomtkn")', '@ApiSecurity("api-key")'],
    response401: {
      status: 401,
      description: 'No autorizado - Requiere autenticación de customer',
    },
  },
};
