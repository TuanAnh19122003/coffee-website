import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { DataSource } from 'typeorm';

export const feedbacksProvider = [
  {
    provide: 'FEEDBACK_REPOSITORY',
    feedbackFactory: (dataSource: DataSource) => dataSource.getRepository(Feedback),
    inject: ['DATA_SOURCE'],
  },
]