import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { DatabaseModule } from 'src/database/migrations/database.module';
import { feedbacksProvider } from 'src/provider/feedbacks.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [FeedbacksController],
  providers: [...feedbacksProvider, FeedbacksService],
  exports: [FeedbacksService],
})
export class FeedbacksModule {}
