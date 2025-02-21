import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiController } from 'src/api/api.controller';
import { UsersModule } from '../users.module';


@Module({
  imports: [
    UsersModule,
    ApiController
  ],
  controllers: [ApiController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
