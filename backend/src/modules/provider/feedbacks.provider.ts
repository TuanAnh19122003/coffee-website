import { Feedback } from 'src/database/entities/feedback.entity';
import { DataSource } from 'typeorm';

export const feedbacksProvider = [
  {
    provide: 'FEEDBACK_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Feedback),
    inject: ['DATA_SOURCE'],
  },
]