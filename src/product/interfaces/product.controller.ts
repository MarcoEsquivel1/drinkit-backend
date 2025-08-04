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
import { ProductService } from '../use-cases/product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  ProductSingleResponseDto,
  ProductCollectionResponseDto,
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

@ApiTags('Products')
@ApiExtraModels(
  ProductResponseDto,
  ProductSingleResponseDto,
  ProductCollectionResponseDto,
)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    type: ProductSingleResponseDto,
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
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductSingleResponseDto> {
    const product = await this.productService.create(createProductDto);
    return ResponseBuilder.success(
      product,
      'Producto creado exitosamente',
    ) as ProductSingleResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
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
    description: 'Lista de productos obtenida exitosamente',
    type: ProductCollectionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findAll(
    @Query() query: PaginationQuery,
  ): Promise<ProductCollectionResponseDto> {
    const { page = 1, size = 10 } = query;
    const { data: products, count } =
      await this.productService.findAllPaginated(page, size);
    const pagination = buildPaginatedResponse(
      products,
      count,
      page,
      size,
    ).pagination;
    return ResponseBuilder.successWithPagination(
      products,
      pagination,
      'Productos obtenidos exitosamente',
    ) as ProductCollectionResponseDto;
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar productos por query' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Término de búsqueda',
    example: 'cerveza',
  })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda realizada exitosamente',
    type: ProductCollectionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async search(
    @Query('q') query: string,
  ): Promise<ProductCollectionResponseDto> {
    const products = await this.productService.search(query);
    return ResponseBuilder.success(
      products,
      'Búsqueda realizada exitosamente',
    ) as ProductCollectionResponseDto;
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Obtener productos por categoría' })
  @ApiParam({
    name: 'categoryId',
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Productos por categoría obtenidos exitosamente',
    type: ProductCollectionResponseDto,
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
  ): Promise<ProductCollectionResponseDto> {
    const products = await this.productService.findByCategory(+categoryId);
    return ResponseBuilder.success(
      products,
      'Productos por categoría obtenidos exitosamente',
    ) as ProductCollectionResponseDto;
  }

  @Get('subcategory/:subcategoryId')
  @ApiOperation({ summary: 'Obtener productos por subcategoría' })
  @ApiParam({
    name: 'subcategoryId',
    description: 'ID de la subcategoría',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Productos por subcategoría obtenidos exitosamente',
    type: ProductCollectionResponseDto,
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
  async findBySubCategory(
    @Param('subcategoryId') subcategoryId: string,
  ): Promise<ProductCollectionResponseDto> {
    const products =
      await this.productService.findBySubCategory(+subcategoryId);
    return ResponseBuilder.success(
      products,
      'Productos por subcategoría obtenidos exitosamente',
    ) as ProductCollectionResponseDto;
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener producto por slug' })
  @ApiParam({
    name: 'slug',
    description: 'Slug del producto',
    example: 'cerveza-corona',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido exitosamente',
    type: ProductSingleResponseDto,
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
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<ProductSingleResponseDto> {
    const product = await this.productService.findBySlug(slug);
    return ResponseBuilder.success(
      product,
      'Producto obtenido exitosamente',
    ) as ProductSingleResponseDto;
  }

  @Get('sku/:sku')
  @ApiOperation({ summary: 'Obtener producto por SKU' })
  @ApiParam({
    name: 'sku',
    description: 'SKU del producto',
    example: 'COR-355-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido exitosamente',
    type: ProductSingleResponseDto,
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
  async findBySku(
    @Param('sku') sku: string,
  ): Promise<ProductSingleResponseDto> {
    const product = await this.productService.findBySku(sku);
    return ResponseBuilder.success(
      product,
      'Producto obtenido exitosamente',
    ) as ProductSingleResponseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido exitosamente',
    type: ProductSingleResponseDto,
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
  async findOne(@Param('id') id: string): Promise<ProductSingleResponseDto> {
    const product = await this.productService.findOne(+id);
    return ResponseBuilder.success(
      product,
      'Producto obtenido exitosamente',
    ) as ProductSingleResponseDto;
  }

  @Patch(':id')
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
    type: ProductSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
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
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductSingleResponseDto> {
    const product = await this.productService.update(+id, updateProductDto);
    return ResponseBuilder.success(
      product,
      'Producto actualizado exitosamente',
    ) as ProductSingleResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Producto eliminado exitosamente',
    schema: createSuccessNullSchema('Producto eliminado exitosamente'),
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
  async remove(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.productService.remove(+id);
    return ResponseBuilder.success(null, 'Producto eliminado exitosamente');
  }
}
