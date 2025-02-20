import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { categoriesProvider } from 'src/provider/categories.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [...categoriesProvider, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
