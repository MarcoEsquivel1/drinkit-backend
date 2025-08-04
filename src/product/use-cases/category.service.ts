import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Category } from '../infrastructure/database/entities';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from '../interfaces/dtos';
import { BaseService } from '../../shared/services/base.service';
import { Paginated } from '../../shared/utils/paginated.util';
import { generateSlug } from '../../shared/utils/text.util';

@Injectable()
export class CategoryService extends BaseService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super();
  }

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    try {
      const category = this.categoryRepository.create({
        ...createCategoryDto,
        createdBy: 'system',
      });
      const savedCategory = await this.categoryRepository.save(category);
      this.logInfo('Categoría creada exitosamente', { id: savedCategory.id });

      const result = plainToInstance(CategoryResponseDto, savedCategory, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(savedCategory.name);
      return result;
    } catch (error) {
      this.handleServiceError(error, 'Error al crear categoría');
    }
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    try {
      const categories = await this.categoryRepository.find({
        relations: ['products', 'subcategories'],
      });
      this.logInfo(`Se encontraron ${categories.length} categorías`);

      return categories.map((category) => {
        const result = plainToInstance(CategoryResponseDto, category, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(category.name);
        return result;
      });
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener categorías');
    }
  }

  async findAllPaginated(
    page: number,
    size: number,
  ): Promise<{ data: CategoryResponseDto[]; count: number }> {
    try {
      const validatedPage = Paginated.validatePage(page);
      const validatedSize = Paginated.getLimit(size);
      const offset = Paginated.getOffset(validatedPage, validatedSize);

      const [data, count] = await this.categoryRepository.findAndCount({
        relations: ['products', 'subcategories'],
        skip: offset,
        take: validatedSize,
        order: { createdAt: 'DESC' },
      });

      this.logInfo(
        `Se encontraron ${count} categorías (página ${validatedPage}, tamaño ${validatedSize})`,
      );

      const categories = data.map((category) => {
        const result = plainToInstance(CategoryResponseDto, category, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(category.name);
        return result;
      });

      return { data: categories, count };
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener categorías paginadas');
    }
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['products', 'subcategories'],
      });

      if (!category) {
        this.createNotFoundError('Categoría', id.toString());
      }

      const result = plainToInstance(CategoryResponseDto, category, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(category.name);
      return result;
    } catch (error) {
      this.handleServiceError(error, `Error al obtener categoría con ID ${id}`);
    }
  }

  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    try {
      const categories = await this.categoryRepository.find({
        relations: ['products', 'subcategories'],
      });

      const category = categories.find((c) => generateSlug(c.name) === slug);

      if (!category) {
        this.createNotFoundError('Categoría', slug);
      }

      const result = plainToInstance(CategoryResponseDto, category, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(category.name);
      return result;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener categoría con slug ${slug}`,
      );
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!category) {
        this.createNotFoundError('Categoría', id.toString());
      }

      Object.assign(category, {
        ...updateCategoryDto,
        updatedBy: 'system',
      });

      const updatedCategory = await this.categoryRepository.save(category);
      this.logInfo('Categoría actualizada exitosamente', {
        id: updatedCategory.id,
      });

      const result = plainToInstance(CategoryResponseDto, updatedCategory, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(updatedCategory.name);
      return result;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al actualizar categoría con ID ${id}`,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!category) {
        this.createNotFoundError('Categoría', id.toString());
      }

      await this.categoryRepository.softRemove(category);
      this.logInfo('Categoría eliminada exitosamente', { id });
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al eliminar categoría con ID ${id}`,
      );
    }
  }

  async search(query: string): Promise<CategoryResponseDto[]> {
    try {
      const categories = await this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.products', 'products')
        .leftJoinAndSelect('category.subcategories', 'subcategories')
        .where('category.name ILIKE :query', { query: `%${query}%` })
        .orWhere('category.description ILIKE :query', { query: `%${query}%` })
        .getMany();

      this.logInfo(
        `Se encontraron ${categories.length} categorías con la búsqueda: ${query}`,
      );

      return categories.map((category) => {
        const result = plainToInstance(CategoryResponseDto, category, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(category.name);
        return result;
      });
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al buscar categorías con query: ${query}`,
      );
    }
  }

  async findActive(): Promise<CategoryResponseDto[]> {
    try {
      const categories = await this.categoryRepository.find({
        where: { active: true },
        relations: ['products', 'subcategories'],
      });

      this.logInfo(`Se encontraron ${categories.length} categorías activas`);

      return categories.map((category) => {
        const result = plainToInstance(CategoryResponseDto, category, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(category.name);
        return result;
      });
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener categorías activas');
    }
  }
}
