import { Payment } from 'src/database/entities/payment.entity';
import { DataSource } from 'typeorm';

export const paymentsProvider = [
  {
    provide: 'PAYMENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Payment),
    inject: ['DATA_SOURCE'],
  },
];
