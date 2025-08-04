import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiExtraModels,
  ApiSecurity,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AdminService } from '../use-cases/admin.service';
import {
  CreateAdminDto,
  UpdateAdminDto,
  AdminResponseDto,
  AdminSingleResponseDto,
  AdminCollectionResponseDto,
} from './dtos';
import { ResponseDto, ResponseBuilder } from '../../shared/dtos/response.dto';
import {
  PaginationQuery,
  buildPaginatedResponse,
} from '../../shared/utils/paginated.util';
import {
  createSuccessNullSchema,
  createErrorSchemas,
} from '../../shared/utils/swagger.util';
import { CredentialsGuard } from '../infrastructure/auth/guards';

@ApiTags('Admin')
@ApiSecurity('admnpomtkn')
@ApiSecurity('api-key')
@UseGuards(CredentialsGuard)
@ApiExtraModels(
  AdminResponseDto,
  AdminSingleResponseDto,
  AdminCollectionResponseDto,
)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Crear un nuevo administrador' })
  @ApiResponse({
    status: 201,
    description: 'Administrador creado exitosamente',
    type: AdminSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: createErrorSchemas()[401],
  })
  @ApiResponse({
    status: 422,
    description: 'Error de validación',
    schema: createErrorSchemas()[422],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async create(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AdminSingleResponseDto> {
    const admin = await this.adminService.create(createAdminDto);
    const responseData = plainToInstance(AdminResponseDto, admin, {
      excludeExtraneousValues: true,
    });
    return ResponseBuilder.success(
      responseData,
      'Administrador creado exitosamente',
    ) as AdminSingleResponseDto;
  }

  @Get()
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Obtener todos los administradores' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Tamaño de página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de administradores obtenida exitosamente',
    type: AdminCollectionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: createErrorSchemas()[401],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findAll(
    @Query() query: PaginationQuery,
  ): Promise<AdminCollectionResponseDto> {
    const { page = 1, size = 10 } = query;
    const { data: admins, count } = await this.adminService.findAllPaginated(
      page,
      size,
    );
    const responseData = admins.map((admin) =>
      plainToInstance(AdminResponseDto, admin, {
        excludeExtraneousValues: true,
      }),
    );
    const pagination = buildPaginatedResponse(
      responseData,
      count,
      page,
      size,
    ).pagination;
    return ResponseBuilder.successWithPagination(
      responseData,
      pagination,
      'Administradores obtenidos exitosamente',
    ) as AdminCollectionResponseDto;
  }

  @Get(':id')
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Obtener un administrador por ID' })
  @ApiParam({ name: 'id', description: 'ID del administrador' })
  @ApiResponse({
    status: 200,
    description: 'Administrador obtenido exitosamente',
    type: AdminSingleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: createErrorSchemas()[401],
  })
  @ApiResponse({
    status: 404,
    description: 'Administrador no encontrado',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findOne(@Param('id') id: string): Promise<AdminSingleResponseDto> {
    const admin = await this.adminService.findOne(id);
    const responseData = plainToInstance(AdminResponseDto, admin, {
      excludeExtraneousValues: true,
    });
    return ResponseBuilder.success(
      responseData,
      'Administrador obtenido exitosamente',
    ) as AdminSingleResponseDto;
  }

  @Patch(':id')
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Actualizar un administrador' })
  @ApiParam({ name: 'id', description: 'ID del administrador' })
  @ApiResponse({
    status: 200,
    description: 'Administrador actualizado exitosamente',
    type: AdminSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: createErrorSchemas()[401],
  })
  @ApiResponse({
    status: 404,
    description: 'Administrador no encontrado',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 422,
    description: 'Error de validación',
    schema: createErrorSchemas()[422],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminSingleResponseDto> {
    const admin = await this.adminService.update(id, updateAdminDto);
    const responseData = plainToInstance(AdminResponseDto, admin, {
      excludeExtraneousValues: true,
    });
    return ResponseBuilder.success(
      responseData,
      'Administrador actualizado exitosamente',
    ) as AdminSingleResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Eliminar un administrador' })
  @ApiParam({ name: 'id', description: 'ID del administrador' })
  @ApiResponse({
    status: 204,
    description: 'Administrador eliminado exitosamente',
    schema: createSuccessNullSchema('Administrador eliminado exitosamente'),
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: createErrorSchemas()[401],
  })
  @ApiResponse({
    status: 404,
    description: 'Administrador no encontrado',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async remove(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.adminService.remove(id);
    return ResponseBuilder.success(
      null,
      'Administrador eliminado exitosamente',
    );
  }
}
