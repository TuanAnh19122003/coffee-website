import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProvider } from 'src/provider/users.provider';
import { DatabaseModule } from 'src/database/database.module';
import { RolesModule } from 'src/roles/roles.module';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { multerConfig } from 'src/multer-config';

@Module({
  imports: [
    DatabaseModule, 
    RolesModule,
    MulterModule.register(multerConfig)
  ],
  controllers: [UsersController],
  providers: [
    ...usersProvider,
    UsersService],
})
export class UsersModule {}
