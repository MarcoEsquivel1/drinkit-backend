import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import {
  Category,
  SubCategory,
  Product,
  Variant,
} from '../infrastructure/database/entities';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from '../interfaces/dtos';
import { BaseService } from '../../shared/services/base.service';
import { Paginated } from '../../shared/utils/paginated.util';
import { generateSlug } from '../../shared/utils/text.util';

@Injectable()
export class ProductService extends BaseService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subcategoryRepository: Repository<SubCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
  ) {
    super();
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    try {
      const product = this.productRepository.create({
        ...createProductDto,
        createdBy: 'system',
      });
      const savedProduct = await this.productRepository.save(product);
      this.logInfo('Producto creado exitosamente', { id: savedProduct.id });

      const result = plainToInstance(ProductResponseDto, savedProduct, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(savedProduct.name);
      return result;
    } catch (error) {
      this.handleServiceError(error, 'Error al crear producto');
    }
  }

  async findAll(): Promise<ProductResponseDto[]> {
    try {
      const products = await this.productRepository.find({
        relations: ['category', 'subcategory', 'variants'],
      });
      this.logInfo(`Se encontraron ${products.length} productos`);

      return products.map((product) => {
        const result = plainToInstance(ProductResponseDto, product, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(product.name);
        return result;
      });
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener productos');
    }
  }

  async findAllPaginated(
    page: number,
    size: number,
  ): Promise<{ data: ProductResponseDto[]; count: number }> {
    try {
      const validatedPage = Paginated.validatePage(page);
      const validatedSize = Paginated.getLimit(size);
      const offset = Paginated.getOffset(validatedPage, validatedSize);

      const [data, count] = await this.productRepository.findAndCount({
        relations: ['category', 'subcategory', 'variants'],
        skip: offset,
        take: validatedSize,
        order: { createdAt: 'DESC' },
      });

      this.logInfo(
        `Se encontraron ${count} productos (página ${validatedPage}, tamaño ${validatedSize})`,
      );

      const products = data.map((product) => {
        const result = plainToInstance(ProductResponseDto, product, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(product.name);
        return result;
      });

      return { data: products, count };
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener productos paginados');
    }
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category', 'subcategory', 'variants'],
      });

      if (!product) {
        this.createNotFoundError('Producto', id.toString());
      }

      const result = plainToInstance(ProductResponseDto, product, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(product.name);
      return result;
    } catch (error) {
      this.handleServiceError(error, `Error al obtener producto con ID ${id}`);
    }
  }

  async findBySlug(slug: string): Promise<ProductResponseDto> {
    try {
      const products = await this.productRepository.find({
        relations: ['category', 'subcategory', 'variants'],
      });

      const product = products.find((p) => generateSlug(p.name) === slug);

      if (!product) {
        this.createNotFoundError('Producto', slug);
      }

      const result = plainToInstance(ProductResponseDto, product, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(product.name);
      return result;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener producto con slug ${slug}`,
      );
    }
  }

  async findBySku(sku: string): Promise<ProductResponseDto> {
    try {
      const product = await this.productRepository.findOne({
        where: { sku },
        relations: ['category', 'subcategory', 'variants'],
      });

      if (!product) {
        this.createNotFoundError('Producto', sku);
      }

      const result = plainToInstance(ProductResponseDto, product, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(product.name);
      return result;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener producto con SKU ${sku}`,
      );
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });

      if (!product) {
        this.createNotFoundError('Producto', id.toString());
      }

      Object.assign(product, {
        ...updateProductDto,
        updatedBy: 'system',
      });

      const updatedProduct = await this.productRepository.save(product);
      this.logInfo('Producto actualizado exitosamente', {
        id: updatedProduct.id,
      });

      const result = plainToInstance(ProductResponseDto, updatedProduct, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(updatedProduct.name);
      return result;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al actualizar producto con ID ${id}`,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });

      if (!product) {
        this.createNotFoundError('Producto', id.toString());
      }

      await this.productRepository.softRemove(product);
      this.logInfo('Producto eliminado exitosamente', { id });
    } catch (error) {
      this.handleServiceError(error, `Error al eliminar producto con ID ${id}`);
    }
  }

  async search(query: string): Promise<ProductResponseDto[]> {
    try {
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.subcategory', 'subcategory')
        .leftJoinAndSelect('product.variants', 'variants')
        .where('product.name ILIKE :query', { query: `%${query}%` })
        .orWhere('product.description ILIKE :query', { query: `%${query}%` })
        .orWhere('product.sku ILIKE :query', { query: `%${query}%` })
        .orWhere('product.keywords @> :keywords', {
          keywords: [query.toLowerCase()],
        })
        .getMany();

      this.logInfo(
        `Se encontraron ${products.length} productos con la búsqueda: ${query}`,
      );

      return products.map((product) => {
        const result = plainToInstance(ProductResponseDto, product, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(product.name);
        return result;
      });
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al buscar productos con query: ${query}`,
      );
    }
  }

  async findByCategory(categoryId: number): Promise<ProductResponseDto[]> {
    try {
      const products = await this.productRepository.find({
        where: { categoryId },
        relations: ['category', 'subcategory', 'variants'],
      });

      this.logInfo(
        `Se encontraron ${products.length} productos en la categoría ${categoryId}`,
      );

      return products.map((product) => {
        const result = plainToInstance(ProductResponseDto, product, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(product.name);
        return result;
      });
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener productos por categoría ${categoryId}`,
      );
    }
  }

  async findBySubCategory(
    subcategoryId: number,
  ): Promise<ProductResponseDto[]> {
    try {
      const products = await this.productRepository.find({
        where: { subcategoryId },
        relations: ['category', 'subcategory', 'variants'],
      });

      this.logInfo(
        `Se encontraron ${products.length} productos en la subcategoría ${subcategoryId}`,
      );

      return products.map((product) => {
        const result = plainToInstance(ProductResponseDto, product, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(product.name);
        return result;
      });
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener productos por subcategoría ${subcategoryId}`,
      );
    }
  }
}
