import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Category,
  SubCategory,
  Product,
  Variant,
} from './infrastructure/database/entities';
import { ProductController } from './interfaces/product.controller';
import { ProductService } from './use-cases/product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, SubCategory, Product, Variant]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
