import { Module } from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';
import { OrderDetailsController } from './order_details.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { order_DetailsProvider } from 'src/provider/order_details.provider';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [DatabaseModule, OrdersModule, ProductsModule],
  controllers: [OrderDetailsController],
  providers: [...order_DetailsProvider, OrderDetailsService],
  exports: [OrderDetailsService],
})
export class OrderDetailsModule {}
