import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from 'src/database/entities/feedback.entity';


@Injectable()
export class FeedbacksService {
  constructor(
    @Inject('FEEDBACK_REPOSITORY')
    private feedbacksRepository : Repository<Feedback>
  ){}

  async findAll() {
    return await this.feedbacksRepository.find();
  }

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbacksRepository.create(createFeedbackDto);
    return await this.feedbacksRepository.save(feedback);
  }

  async findOne(id: number): Promise<Feedback> {

    const feedback = await this.feedbacksRepository.findOne({where: {id}});
    if(!feedback){
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return feedback;
  }
  async update(id: number, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback | null>{
    const feedback = await this.findOne(id);
    if(!feedback){
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    await this.feedbacksRepository.update(id, updateFeedbackDto);
    return { ...feedback, ...updateFeedbackDto}
  }

  async remove(id: number): Promise<void> {
    await this.feedbacksRepository.delete({id})
  }
}
