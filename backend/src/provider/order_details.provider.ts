import { OrderDetail } from 'src/order_details/entities/order_detail.entity';
import { DataSource } from 'typeorm';

export const order_DetailsProvider = [
  {
    provide: 'ORDER_DETAIL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OrderDetail),
    inject: ['DATA_SOURCE'],
  },
]