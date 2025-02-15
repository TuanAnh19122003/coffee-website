import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { UsersModule } from '../users/users.module';
import { ordersProvider } from 'src/provider/orders.provider';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [OrdersController],
  providers: [
    ...ordersProvider,
    OrdersService
  ],
  exports: [OrdersService]
})
export class OrdersModule {}
