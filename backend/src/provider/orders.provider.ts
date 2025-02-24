import { DataSource } from 'typeorm';
import { Order } from 'src/database/entities/order.entity';
import { OrderDetail } from 'src/database/entities/order_detail.entity';

export const ordersProvider = [
  {
    provide: 'ORDER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ORDER_DETAIL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OrderDetail),
    inject: ['DATA_SOURCE'],
  },
];
