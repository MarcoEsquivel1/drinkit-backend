import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { SubCategory } from '../infrastructure/database/entities';
import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
  SubCategoryResponseDto,
} from '../interfaces/dtos';
import { BaseService } from '../../shared/services/base.service';
import { Paginated } from '../../shared/utils/paginated.util';
import { generateSlug } from '../../shared/utils/text.util';

@Injectable()
export class SubCategoryService extends BaseService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subcategoryRepository: Repository<SubCategory>,
  ) {
    super();
  }

  async create(
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategoryResponseDto> {
    try {
      const subcategory = this.subcategoryRepository.create({
        ...createSubCategoryDto,
      });
      const savedSubCategory =
        await this.subcategoryRepository.save(subcategory);
      this.logInfo('Subcategoría creada exitosamente', {
        id: savedSubCategory.subCategoryId,
      });

      const result = plainToInstance(SubCategoryResponseDto, savedSubCategory, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(savedSubCategory.name);
      return result;
    } catch (error) {
      this.handleServiceError(error, 'Error al crear subcategoría');
    }
  }

  async findAll(): Promise<SubCategoryResponseDto[]> {
    try {
      const subcategories = await this.subcategoryRepository.find({
        relations: ['category', 'products'],
      });
      this.logInfo(`Se encontraron ${subcategories.length} subcategorías`);

      return subcategories.map((subcategory) => {
        const result = plainToInstance(SubCategoryResponseDto, subcategory, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(subcategory.name);
        return result;
      });
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener subcategorías');
    }
  }

  async findAllPaginated(
    page: number,
    size: number,
  ): Promise<{ data: SubCategoryResponseDto[]; count: number }> {
    try {
      const validatedPage = Paginated.validatePage(page);
      const validatedSize = Paginated.getLimit(size);
      const offset = Paginated.getOffset(validatedPage, validatedSize);

      const [data, count] = await this.subcategoryRepository.findAndCount({
        relations: ['category', 'products'],
        skip: offset,
        take: validatedSize,
        order: { createdAt: 'DESC' },
      });

      this.logInfo(
        `Se encontraron ${count} subcategorías (página ${validatedPage}, tamaño ${validatedSize})`,
      );

      const subcategories = data.map((subcategory) => {
        const result = plainToInstance(SubCategoryResponseDto, subcategory, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(subcategory.name);
        return result;
      });

      return { data: subcategories, count };
    } catch (error) {
      this.handleServiceError(
        error,
        'Error al obtener subcategorías paginadas',
      );
    }
  }

  async findOne(id: number): Promise<SubCategoryResponseDto> {
    try {
      const subcategory = await this.subcategoryRepository.findOne({
        where: { subCategoryId: id },
        relations: ['category', 'products'],
      });

      if (!subcategory) {
        this.createNotFoundError('Subcategoría', id.toString());
      }

      const result = plainToInstance(SubCategoryResponseDto, subcategory, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(subcategory.name);
      return result;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener subcategoría con ID ${id}`,
      );
    }
  }

  async findBySlug(slug: string): Promise<SubCategoryResponseDto> {
    try {
      const subcategories = await this.subcategoryRepository.find({
        relations: ['category', 'products'],
      });

      const subcategory = subcategories.find(
        (sc) => generateSlug(sc.name) === slug,
      );

      if (!subcategory) {
        this.createNotFoundError('Subcategoría', slug);
      }

      const result = plainToInstance(SubCategoryResponseDto, subcategory, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(subcategory.name);
      return result;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener subcategoría con slug ${slug}`,
      );
    }
  }

  async update(
    id: number,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategoryResponseDto> {
    try {
      const subcategory = await this.subcategoryRepository.findOne({
        where: { subCategoryId: id },
      });

      if (!subcategory) {
        this.createNotFoundError('Subcategoría', id.toString());
      }

      Object.assign(subcategory, updateSubCategoryDto);

      const updatedSubCategory =
        await this.subcategoryRepository.save(subcategory);
      this.logInfo('Subcategoría actualizada exitosamente', {
        id: updatedSubCategory.subCategoryId,
      });

      const result = plainToInstance(
        SubCategoryResponseDto,
        updatedSubCategory,
        {
          excludeExtraneousValues: true,
        },
      );
      result.slug = generateSlug(updatedSubCategory.name);
      return result;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al actualizar subcategoría con ID ${id}`,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const subcategory = await this.subcategoryRepository.findOne({
        where: { subCategoryId: id },
      });

      if (!subcategory) {
        this.createNotFoundError('Subcategoría', id.toString());
      }

      await this.subcategoryRepository.softRemove(subcategory);
      this.logInfo('Subcategoría eliminada exitosamente', { id });
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al eliminar subcategoría con ID ${id}`,
      );
    }
  }

  async search(query: string): Promise<SubCategoryResponseDto[]> {
    try {
      const subcategories = await this.subcategoryRepository
        .createQueryBuilder('subcategory')
        .leftJoinAndSelect('subcategory.category', 'category')
        .leftJoinAndSelect('subcategory.products', 'products')
        .where('subcategory.name ILIKE :query', { query: `%${query}%` })
        .orWhere('subcategory.description ILIKE :query', {
          query: `%${query}%`,
        })
        .getMany();

      this.logInfo(
        `Se encontraron ${subcategories.length} subcategorías con la búsqueda: ${query}`,
      );

      return subcategories.map((subcategory) => {
        const result = plainToInstance(SubCategoryResponseDto, subcategory, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(subcategory.name);
        return result;
      });
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al buscar subcategorías con query: ${query}`,
      );
    }
  }

  async findByCategory(categoryId: number): Promise<SubCategoryResponseDto[]> {
    try {
      const subcategories = await this.subcategoryRepository.find({
        where: { fk_categoryId: categoryId },
        relations: ['category', 'products'],
      });

      this.logInfo(
        `Se encontraron ${subcategories.length} subcategorías en la categoría ${categoryId}`,
      );

      return subcategories.map((subcategory) => {
        const result = plainToInstance(SubCategoryResponseDto, subcategory, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(subcategory.name);
        return result;
      });
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener subcategorías por categoría ${categoryId}`,
      );
    }
  }

  async findActive(): Promise<SubCategoryResponseDto[]> {
    try {
      const subcategories = await this.subcategoryRepository.find({
        where: { activeSubCategory: true },
        relations: ['category', 'products'],
      });

      this.logInfo(
        `Se encontraron ${subcategories.length} subcategorías activas`,
      );

      return subcategories.map((subcategory) => {
        const result = plainToInstance(SubCategoryResponseDto, subcategory, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(subcategory.name);
        return result;
      });
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener subcategorías activas');
    }
  }
}
