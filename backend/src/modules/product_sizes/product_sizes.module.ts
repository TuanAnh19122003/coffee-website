import { Module } from '@nestjs/common';
import { ProductSizesService } from './product_sizes.service';
import { ProductSizesController } from './product_sizes.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { product_sizeProvider } from 'src/provider/product_sizes.provider';
import { ProductsModule } from '../products/products.module';

@Module({
  imports:[DatabaseModule, ProductsModule],
  controllers: [ProductSizesController],
  providers: [
    ...product_sizeProvider,
    ProductSizesService
  ],
  exports: [ProductSizesService],
})
export class ProductSizesModule {}
