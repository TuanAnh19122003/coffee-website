import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ProductsService } from 'src/modules/products/products.service';
import { ProductSizesService } from 'src/modules/product_sizes/product_sizes.service';

@Controller('api')
export class ApiController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productSizesService: ProductSizesService,
  ) {}

  // API lấy tất cả sản phẩm
  @Get('/products')
  async getAllProducts() {
    const products = await this.productsService.getAllProduct();
    const productSizes = await this.productSizesService.getAllProductSize();

    const productsWithSizes = products.map((product) => {
      const sizes = productSizes.filter(
        (size) => size.productId === product.id,
      );
      return {
        ...product,
        product_sizes: sizes,
      };
    });

    return { products: productsWithSizes };
  }

  @Get('/:id')
  async getProductById(@Param('id') id: number) {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { product };
  }
}
