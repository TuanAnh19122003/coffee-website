import { Order } from 'src/database/entities/order.entity';
import { DataSource } from 'typeorm';

export const ordersProvider = [
  {
    provide: 'ORDER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
    inject: ['DATA_SOURCE'],
  },
]