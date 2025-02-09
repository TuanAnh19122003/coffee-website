import { Product } from 'src/products/entities/product.entity';
import { DataSource } from 'typeorm';

export const productsProvider = [
  {
    provide: 'PRODUCT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
    inject: ['DATA_SOURCE'],
  },
]