import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductSizesModule } from './modules/product_sizes/product_sizes.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { OrderDetailsModule } from './modules/order_details/order_details.module';


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
