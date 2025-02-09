import { Role } from 'src/roles/entities/role.entity';
import { DataSource } from 'typeorm';

export const rolesProvider = [
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Role),
    inject: ['DATA_SOURCE'],
  },
]