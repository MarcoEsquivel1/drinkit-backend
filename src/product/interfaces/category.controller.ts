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
import { CategoryService } from '../use-cases/category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
  CategorySingleResponseDto,
  CategoryCollectionResponseDto,
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

@ApiTags('Categories')
@ApiExtraModels(
  CategoryResponseDto,
  CategorySingleResponseDto,
  CategoryCollectionResponseDto,
)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada exitosamente',
    type: CategorySingleResponseDto,
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
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategorySingleResponseDto> {
    const category = await this.categoryService.create(createCategoryDto);
    return ResponseBuilder.success(
      category,
      'Categoría creada exitosamente',
    ) as CategorySingleResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
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
    description: 'Lista de categorías obtenida exitosamente',
    type: CategoryCollectionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findAll(
    @Query() query: PaginationQuery,
  ): Promise<CategoryCollectionResponseDto> {
    const { page = 1, size = 10 } = query;
    const { data: categories, count } =
      await this.categoryService.findAllPaginated(page, size);
    const pagination = buildPaginatedResponse(
      categories,
      count,
      page,
      size,
    ).pagination;
    return ResponseBuilder.successWithPagination(
      categories,
      pagination,
      'Categorías obtenidas exitosamente',
    ) as CategoryCollectionResponseDto;
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar categorías por query' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Término de búsqueda',
    example: 'bebidas',
  })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda realizada exitosamente',
    type: CategoryCollectionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async search(
    @Query('q') query: string,
  ): Promise<CategoryCollectionResponseDto> {
    const categories = await this.categoryService.search(query);
    return ResponseBuilder.success(
      categories,
      'Búsqueda realizada exitosamente',
    ) as CategoryCollectionResponseDto;
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener categorías activas' })
  @ApiResponse({
    status: 200,
    description: 'Categorías activas obtenidas exitosamente',
    type: CategoryCollectionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findActive(): Promise<CategoryCollectionResponseDto> {
    const categories = await this.categoryService.findActive();
    return ResponseBuilder.success(
      categories,
      'Categorías activas obtenidas exitosamente',
    ) as CategoryCollectionResponseDto;
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener categoría por slug' })
  @ApiParam({
    name: 'slug',
    description: 'Slug de la categoría',
    example: 'bebidas-alcoholicas',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría obtenida exitosamente',
    type: CategorySingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<CategorySingleResponseDto> {
    const category = await this.categoryService.findBySlug(slug);
    return ResponseBuilder.success(
      category,
      'Categoría obtenida exitosamente',
    ) as CategorySingleResponseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría obtenida exitosamente',
    type: CategorySingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findOne(@Param('id') id: string): Promise<CategorySingleResponseDto> {
    const category = await this.categoryService.findOne(+id);
    return ResponseBuilder.success(
      category,
      'Categoría obtenida exitosamente',
    ) as CategorySingleResponseDto;
  }

  @Patch(':id')
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada exitosamente',
    type: CategorySingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
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
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategorySingleResponseDto> {
    const category = await this.categoryService.update(+id, updateCategoryDto);
    return ResponseBuilder.success(
      category,
      'Categoría actualizada exitosamente',
    ) as CategorySingleResponseDto;
  }

  @Delete(':id')
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Categoría eliminada exitosamente',
    schema: createSuccessNullSchema('Categoría eliminada exitosamente'),
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async remove(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.categoryService.remove(+id);
    return ResponseBuilder.success(null, 'Categoría eliminada exitosamente');
  }
}
