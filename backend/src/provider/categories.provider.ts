import { Category } from '../categories/entities/category.entity';
import { DataSource } from 'typeorm';

export const categoriesProvider = [
  {
    provide: 'CATEGORY_REPOSITORY',
    categoryFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: ['DATA_SOURCE'],
  },
]