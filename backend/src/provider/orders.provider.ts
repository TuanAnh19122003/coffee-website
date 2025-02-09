import { Order } from 'src/orders/entities/order.entity';
import { DataSource } from 'typeorm';

export const ordersProvider = [
  {
    provide: 'ORDER_REPOSITORY',
    orderFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
    inject: ['DATA_SOURCE'],
  },
]