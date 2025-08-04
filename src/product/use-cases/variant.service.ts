import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Variant } from '../infrastructure/database/entities';
import {
  CreateVariantDto,
  UpdateVariantDto,
  VariantResponseDto,
} from '../interfaces/dtos';
import { BaseService } from '../../shared/services/base.service';
import { Paginated } from '../../shared/utils/paginated.util';
import { generateSlug } from '../../shared/utils/text.util';

@Injectable()
export class VariantService extends BaseService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
  ) {
    super();
  }

  async create(
    createVariantDto: CreateVariantDto,
  ): Promise<VariantResponseDto> {
    try {
      const variant = this.variantRepository.create({
        ...createVariantDto,
      });
      const savedVariant = await this.variantRepository.save(variant);
      this.logInfo('Variante creada exitosamente', {
        id: savedVariant.variantId,
      });

      const result = plainToInstance(VariantResponseDto, savedVariant, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(savedVariant.nameProduct);
      return result;
    } catch (error) {
      this.handleServiceError(error, 'Error al crear variante');
    }
  }

  async findAll(): Promise<VariantResponseDto[]> {
    try {
      const variants = await this.variantRepository.find({
        relations: ['product'],
      });
      this.logInfo(`Se encontraron ${variants.length} variantes`);

      return variants.map((variant) => {
        const result = plainToInstance(VariantResponseDto, variant, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(variant.nameProduct);
        return result;
      });
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener variantes');
    }
  }

  async findAllPaginated(
    page: number,
    size: number,
  ): Promise<{ data: VariantResponseDto[]; count: number }> {
    try {
      const validatedPage = Paginated.validatePage(page);
      const validatedSize = Paginated.getLimit(size);
      const offset = Paginated.getOffset(validatedPage, validatedSize);

      const [data, count] = await this.variantRepository.findAndCount({
        relations: ['product'],
        skip: offset,
        take: validatedSize,
        order: { createdAt: 'DESC' },
      });

      this.logInfo(
        `Se encontraron ${count} variantes (página ${validatedPage}, tamaño ${validatedSize})`,
      );

      const variants = data.map((variant) => {
        const result = plainToInstance(VariantResponseDto, variant, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(variant.nameProduct);
        return result;
      });

      return { data: variants, count };
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener variantes paginadas');
    }
  }

  async findOne(id: number): Promise<VariantResponseDto> {
    try {
      const variant = await this.variantRepository.findOne({
        where: { variantId: id },
        relations: ['product'],
      });

      if (!variant) {
        this.createNotFoundError('Variante', id.toString());
      }

      const result = plainToInstance(VariantResponseDto, variant, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(variant.nameProduct);
      return result;
    } catch (error) {
      this.handleServiceError(error, `Error al obtener variante con ID ${id}`);
    }
  }

  async findBySlug(slug: string): Promise<VariantResponseDto> {
    try {
      const variants = await this.variantRepository.find({
        relations: ['product'],
      });

      const variant = variants.find(
        (v) => generateSlug(v.nameProduct) === slug,
      );

      if (!variant) {
        this.createNotFoundError('Variante', slug);
      }

      const result = plainToInstance(VariantResponseDto, variant, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(variant.nameProduct);
      return result;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener variante con slug ${slug}`,
      );
    }
  }

  async findBySku(sku: string): Promise<VariantResponseDto> {
    try {
      const variant = await this.variantRepository.findOne({
        where: { sku },
        relations: ['product'],
      });

      if (!variant) {
        this.createNotFoundError('Variante', sku);
      }

      const result = plainToInstance(VariantResponseDto, variant, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(variant.nameProduct);
      return result;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener variante con SKU ${sku}`,
      );
    }
  }

  async update(
    id: number,
    updateVariantDto: UpdateVariantDto,
  ): Promise<VariantResponseDto> {
    try {
      const variant = await this.variantRepository.findOne({
        where: { variantId: id },
      });

      if (!variant) {
        this.createNotFoundError('Variante', id.toString());
      }

      Object.assign(variant, updateVariantDto);

      const updatedVariant = await this.variantRepository.save(variant);
      this.logInfo('Variante actualizada exitosamente', {
        id: updatedVariant.variantId,
      });

      const result = plainToInstance(VariantResponseDto, updatedVariant, {
        excludeExtraneousValues: true,
      });
      result.slug = generateSlug(updatedVariant.nameProduct);
      return result;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al actualizar variante con ID ${id}`,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const variant = await this.variantRepository.findOne({
        where: { variantId: id },
      });

      if (!variant) {
        this.createNotFoundError('Variante', id.toString());
      }

      await this.variantRepository.softRemove(variant);
      this.logInfo('Variante eliminada exitosamente', { id });
    } catch (error) {
      this.handleServiceError(error, `Error al eliminar variante con ID ${id}`);
    }
  }

  async search(query: string): Promise<VariantResponseDto[]> {
    try {
      const variants = await this.variantRepository
        .createQueryBuilder('variant')
        .leftJoinAndSelect('variant.product', 'product')
        .where('variant.nameProduct ILIKE :query', { query: `%${query}%` })
        .orWhere('variant.sku ILIKE :query', { query: `%${query}%` })
        .getMany();

      this.logInfo(
        `Se encontraron ${variants.length} variantes con la búsqueda: ${query}`,
      );

      return variants.map((variant) => {
        const result = plainToInstance(VariantResponseDto, variant, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(variant.nameProduct);
        return result;
      });
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al buscar variantes con query: ${query}`,
      );
    }
  }

  async findByProduct(productId: number): Promise<VariantResponseDto[]> {
    try {
      const variants = await this.variantRepository.find({
        where: { fk_productId: productId },
        relations: ['product'],
      });

      this.logInfo(
        `Se encontraron ${variants.length} variantes del producto ${productId}`,
      );

      return variants.map((variant) => {
        const result = plainToInstance(VariantResponseDto, variant, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(variant.nameProduct);
        return result;
      });
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener variantes por producto ${productId}`,
      );
    }
  }

  async findActive(): Promise<VariantResponseDto[]> {
    try {
      const variants = await this.variantRepository.find({
        where: { active: true },
        relations: ['product'],
      });

      this.logInfo(`Se encontraron ${variants.length} variantes activas`);

      return variants.map((variant) => {
        const result = plainToInstance(VariantResponseDto, variant, {
          excludeExtraneousValues: true,
        });
        result.slug = generateSlug(variant.nameProduct);
        return result;
      });
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener variantes activas');
    }
  }
}
