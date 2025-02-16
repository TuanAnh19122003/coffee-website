import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { paymentsProvider } from 'src/provider/payments.provider';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports:[DatabaseModule, OrdersModule],
  controllers: [PaymentsController],
  providers: [
    ...paymentsProvider,
    PaymentsService
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
