import { Controller } from '@nestjs/common';
import { ProductService } from '../use-cases/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
}
