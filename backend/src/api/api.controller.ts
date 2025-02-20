import { Controller, Get, Param, NotFoundException, Post, Body } from '@nestjs/common';
import { ProductsService } from 'src/modules/products/products.service';
import { ProductSizesService } from 'src/modules/product_sizes/product_sizes.service';
import { FeedbacksService } from 'src/modules/feedbacks/feedbacks.service';
import { CreateFeedbackDto } from 'src/modules/feedbacks/dto/create-feedback.dto';

@Controller('api')
export class ApiController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productSizesService: ProductSizesService,
    private readonly feedbacksService: FeedbacksService,
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

  @Get('/products/:id')
  async getProductById(@Param('id') id: number) {
    const product = await this.productsService.findOne(id);
  
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  
    // Tính toán giá sau khi giảm cho từng kích thước sản phẩm
    const updatedProduct = {
      ...product,
      product_sizes: product.product_sizes?.map((size) => {
        const discount = product.discount || 0; // Giảm giá của sản phẩm
        const priceProduct = Number(size.price) * (1 - discount / 100);
  
        return {
          ...size,
          priceProduct: priceProduct.toFixed(2), // Làm tròn 2 chữ số
        };
      }),
    };
  
    return { product: updatedProduct };
  }
  @Post('/feedbacks/create')
  async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    const newFeedback = this.feedbacksService.create(createFeedbackDto);
    return { message: 'Feedback submitted successfully', feedback: newFeedback };
  }
}
