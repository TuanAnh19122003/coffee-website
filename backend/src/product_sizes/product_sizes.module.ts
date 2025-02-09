import { Module } from '@nestjs/common';
import { ProductSizesService } from './product_sizes.service';
import { ProductSizesController } from './product_sizes.controller';

@Module({
  controllers: [ProductSizesController],
  providers: [ProductSizesService],
})
export class ProductSizesModule {}
