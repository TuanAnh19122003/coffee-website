import { ProductSize } from 'src/database/entities/product_size.entity';
import { DataSource } from 'typeorm';

export const product_sizeProvider = [
  {
    provide: 'PRODUCT_SIZE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ProductSize),
    inject: ['DATA_SOURCE'],
  },
]