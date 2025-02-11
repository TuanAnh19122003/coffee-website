import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { productsProvider } from 'src/provider/products.provider';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { CategoriesModule } from '../categories/categories.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer-config';

@Module({
  imports: [
    DatabaseModule, 
    CategoriesModule,
    MulterModule.register(multerConfig)
  ],
  controllers: [ProductsController],
  providers: [
    ...productsProvider,
    ProductsService
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
