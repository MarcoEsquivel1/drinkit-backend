import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Category,
  SubCategory,
  Product,
  Variant,
} from './infrastructure/database/entities';
import { ProductController } from './interfaces/product.controller';
import { CategoryController } from './interfaces/category.controller';
import { SubCategoryController } from './interfaces/subcategory.controller';
import { VariantController } from './interfaces/variant.controller';
import { ProductService } from './use-cases/product.service';
import { CategoryService } from './use-cases/category.service';
import { SubCategoryService } from './use-cases/subcategory.service';
import { VariantService } from './use-cases/variant.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, SubCategory, Product, Variant]),
    SharedModule,
  ],
  controllers: [
    ProductController,
    CategoryController,
    SubCategoryController,
    VariantController,
  ],
  providers: [
    ProductService,
    CategoryService,
    SubCategoryService,
    VariantService,
  ],
  exports: [
    ProductService,
    CategoryService,
    SubCategoryService,
    VariantService,
    TypeOrmModule,
  ],
})
export class ProductModule {}
