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
  ApiParam,
  ApiExtraModels,
  ApiResponse,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { VariantService } from '../use-cases/variant.service';
import {
  CreateVariantDto,
  UpdateVariantDto,
  VariantResponseDto,
  VariantSingleResponseDto,
  VariantCollectionResponseDto,
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
import { CredentialsGuard } from '../../admin/infrastructure/auth/guards';

@ApiTags('Variants')
@ApiExtraModels(
  VariantResponseDto,
  VariantSingleResponseDto,
  VariantCollectionResponseDto,
)
@Controller('variants')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Crear una nueva variante' })
  @ApiResponse({
    status: 201,
    description: 'Variante creada exitosamente',
    type: VariantSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
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
    @Body() createVariantDto: CreateVariantDto,
  ): Promise<VariantSingleResponseDto> {
    const variant = await this.variantService.create(createVariantDto);
    return ResponseBuilder.success(
      variant,
      'Variante creada exitosamente',
    ) as VariantSingleResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las variantes' })
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
    description: 'Lista de variantes obtenida exitosamente',
    type: VariantCollectionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findAll(
    @Query() query: PaginationQuery,
  ): Promise<VariantCollectionResponseDto> {
    const { page = 1, size = 10 } = query;
    const { data: variants, count } =
      await this.variantService.findAllPaginated(page, size);
    const pagination = buildPaginatedResponse(
      variants,
      count,
      page,
      size,
    ).pagination;
    return ResponseBuilder.successWithPagination(
      variants,
      pagination,
      'Variantes obtenidas exitosamente',
    ) as VariantCollectionResponseDto;
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Obtener variantes por producto' })
  @ApiParam({ name: 'productId', description: 'ID del producto' })
  @ApiResponse({
    status: 200,
    description: 'Variantes por producto obtenidas exitosamente',
    type: VariantCollectionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findByProduct(
    @Param('productId') productId: string,
  ): Promise<VariantCollectionResponseDto> {
    const variants = await this.variantService.findByProduct(+productId);
    return ResponseBuilder.success(
      variants,
      'Variantes por producto obtenidas exitosamente',
    ) as VariantCollectionResponseDto;
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener variantes activas' })
  @ApiResponse({
    status: 200,
    description: 'Variantes activas obtenidas exitosamente',
    type: VariantCollectionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findActive(): Promise<VariantCollectionResponseDto> {
    const variants = await this.variantService.findActive();
    return ResponseBuilder.success(
      variants,
      'Variantes activas obtenidas exitosamente',
    ) as VariantCollectionResponseDto;
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener variante por slug' })
  @ApiParam({ name: 'slug', description: 'Slug de la variante' })
  @ApiResponse({
    status: 200,
    description: 'Variante obtenida exitosamente',
    type: VariantSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Variante no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<VariantSingleResponseDto> {
    const variant = await this.variantService.findBySlug(slug);
    return ResponseBuilder.success(
      variant,
      'Variante obtenida exitosamente',
    ) as VariantSingleResponseDto;
  }

  @Get('sku/:sku')
  @ApiOperation({ summary: 'Obtener variante por SKU' })
  @ApiParam({ name: 'sku', description: 'SKU de la variante' })
  @ApiResponse({
    status: 200,
    description: 'Variante obtenida exitosamente',
    type: VariantSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Variante no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findBySku(
    @Param('sku') sku: string,
  ): Promise<VariantSingleResponseDto> {
    const variant = await this.variantService.findBySku(sku);
    return ResponseBuilder.success(
      variant,
      'Variante obtenida exitosamente',
    ) as VariantSingleResponseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener variante por ID' })
  @ApiParam({ name: 'id', description: 'ID de la variante' })
  @ApiResponse({
    status: 200,
    description: 'Variante obtenida exitosamente',
    type: VariantSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Variante no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findOne(@Param('id') id: string): Promise<VariantSingleResponseDto> {
    const variant = await this.variantService.findOne(+id);
    return ResponseBuilder.success(
      variant,
      'Variante obtenida exitosamente',
    ) as VariantSingleResponseDto;
  }

  @Patch(':id')
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Actualizar una variante' })
  @ApiParam({ name: 'id', description: 'ID de la variante' })
  @ApiResponse({
    status: 200,
    description: 'Variante actualizada exitosamente',
    type: VariantSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 404,
    description: 'Variante no encontrada',
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
    @Body() updateVariantDto: UpdateVariantDto,
  ): Promise<VariantSingleResponseDto> {
    const variant = await this.variantService.update(+id, updateVariantDto);
    return ResponseBuilder.success(
      variant,
      'Variante actualizada exitosamente',
    ) as VariantSingleResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Eliminar una variante' })
  @ApiParam({ name: 'id', description: 'ID de la variante' })
  @ApiResponse({
    status: 204,
    description: 'Variante eliminada exitosamente',
    schema: createSuccessNullSchema('Variante eliminada exitosamente'),
  })
  @ApiResponse({
    status: 404,
    description: 'Variante no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async remove(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.variantService.remove(+id);
    return ResponseBuilder.success(null, 'Variante eliminada exitosamente');
  }
}
