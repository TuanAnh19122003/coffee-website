import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DatabaseModule } from 'src/database/database.module';
import { rolesProvider } from 'src/provider/roles.provider';

@Module({
  imports:[DatabaseModule],
  controllers: [RolesController],
  providers: [
    ...rolesProvider,
    RolesService],
})
export class RolesModule {}
