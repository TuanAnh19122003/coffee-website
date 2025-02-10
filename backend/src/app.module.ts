import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProductSizesModule } from './product_sizes/product_sizes.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { OrderDetailsModule } from './order_details/order_details.module';


@Module({
  imports: [
    RolesModule, 
    UsersModule, 
    CategoriesModule, 
    ProductsModule, 
    ProductSizesModule, 
    FeedbacksModule, 
    OrdersModule, 
    PaymentsModule, 
    OrderDetailsModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
