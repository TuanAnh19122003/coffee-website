import { Module , MiddlewareConsumer} from '@nestjs/common';
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
import { ApiController } from './api/api.controller';
import { AuthService } from './modules/users/auth/auth.service';
import { UserMiddleware } from './middlewares/user.middleware';
import { AuthMiddleware } from './middlewares/auth.middleware';


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
  controllers: [AppController, ApiController],
  providers: [AppService, AuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*')
    consumer.apply(AuthMiddleware).forRoutes('/api/auth/login');
  }
}
