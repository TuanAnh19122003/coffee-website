import { Payment } from 'src/payments/entities/payment.entity';
import { DataSource } from 'typeorm';

export const paymentsProvider = [
  {
    provide: 'PAYMENT_REPOSITORY',
    paymentFactory: (dataSource: DataSource) => dataSource.getRepository(Payment),
    inject: ['DATA_SOURCE'],
  },
]