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
import { SubCategoryService } from '../use-cases/subcategory.service';
import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
  SubCategoryResponseDto,
  SubCategorySingleResponseDto,
  SubCategoryCollectionResponseDto,
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

@ApiTags('SubCategories')
@ApiExtraModels(
  SubCategoryResponseDto,
  SubCategorySingleResponseDto,
  SubCategoryCollectionResponseDto,
)
@Controller('subcategories')
export class SubCategoryController {
  constructor(private readonly subcategoryService: SubCategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Crear una nueva subcategoría' })
  @ApiResponse({
    status: 201,
    description: 'Subcategoría creada exitosamente',
    type: SubCategorySingleResponseDto,
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
    @Body() createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategorySingleResponseDto> {
    const subcategory =
      await this.subcategoryService.create(createSubCategoryDto);
    return ResponseBuilder.success(
      subcategory,
      'Subcategoría creada exitosamente',
    ) as SubCategorySingleResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las subcategorías' })
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
    description: 'Lista de subcategorías obtenida exitosamente',
    type: SubCategoryCollectionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findAll(
    @Query() query: PaginationQuery,
  ): Promise<SubCategoryCollectionResponseDto> {
    const { page = 1, size = 10 } = query;
    const { data: subcategories, count } =
      await this.subcategoryService.findAllPaginated(page, size);
    const pagination = buildPaginatedResponse(
      subcategories,
      count,
      page,
      size,
    ).pagination;
    return ResponseBuilder.successWithPagination(
      subcategories,
      pagination,
      'Subcategorías obtenidas exitosamente',
    ) as SubCategoryCollectionResponseDto;
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Obtener subcategorías por categoría' })
  @ApiParam({ name: 'categoryId', description: 'ID de la categoría' })
  @ApiResponse({
    status: 200,
    description: 'Subcategorías por categoría obtenidas exitosamente',
    type: SubCategoryCollectionResponseDto,
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
  async findByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<SubCategoryCollectionResponseDto> {
    const subcategories =
      await this.subcategoryService.findByCategory(+categoryId);
    return ResponseBuilder.success(
      subcategories,
      'Subcategorías por categoría obtenidas exitosamente',
    ) as SubCategoryCollectionResponseDto;
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener subcategorías activas' })
  @ApiResponse({
    status: 200,
    description: 'Subcategorías activas obtenidas exitosamente',
    type: SubCategoryCollectionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findActive(): Promise<SubCategoryCollectionResponseDto> {
    const subcategories = await this.subcategoryService.findActive();
    return ResponseBuilder.success(
      subcategories,
      'Subcategorías activas obtenidas exitosamente',
    ) as SubCategoryCollectionResponseDto;
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener subcategoría por slug' })
  @ApiParam({ name: 'slug', description: 'Slug de la subcategoría' })
  @ApiResponse({
    status: 200,
    description: 'Subcategoría obtenida exitosamente',
    type: SubCategorySingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Subcategoría no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<SubCategorySingleResponseDto> {
    const subcategory = await this.subcategoryService.findBySlug(slug);
    return ResponseBuilder.success(
      subcategory,
      'Subcategoría obtenida exitosamente',
    ) as SubCategorySingleResponseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener subcategoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la subcategoría' })
  @ApiResponse({
    status: 200,
    description: 'Subcategoría obtenida exitosamente',
    type: SubCategorySingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Subcategoría no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<SubCategorySingleResponseDto> {
    const subcategory = await this.subcategoryService.findOne(+id);
    return ResponseBuilder.success(
      subcategory,
      'Subcategoría obtenida exitosamente',
    ) as SubCategorySingleResponseDto;
  }

  @Patch(':id')
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Actualizar una subcategoría' })
  @ApiParam({ name: 'id', description: 'ID de la subcategoría' })
  @ApiResponse({
    status: 200,
    description: 'Subcategoría actualizada exitosamente',
    type: SubCategorySingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 404,
    description: 'Subcategoría no encontrada',
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
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategorySingleResponseDto> {
    const subcategory = await this.subcategoryService.update(
      +id,
      updateSubCategoryDto,
    );
    return ResponseBuilder.success(
      subcategory,
      'Subcategoría actualizada exitosamente',
    ) as SubCategorySingleResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Eliminar una subcategoría' })
  @ApiParam({ name: 'id', description: 'ID de la subcategoría' })
  @ApiResponse({
    status: 204,
    description: 'Subcategoría eliminada exitosamente',
    schema: createSuccessNullSchema('Subcategoría eliminada exitosamente'),
  })
  @ApiResponse({
    status: 404,
    description: 'Subcategoría no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async remove(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.subcategoryService.remove(+id);
    return ResponseBuilder.success(null, 'Subcategoría eliminada exitosamente');
  }
}
