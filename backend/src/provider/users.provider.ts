import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

export const usersProvider = [
  {
    provide: 'USER_REPOSITORY',
    usersFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
]