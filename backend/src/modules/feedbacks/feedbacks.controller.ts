import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect, Req } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Get()
  @Render('feedbacks/list')
  async getAllFeedbacks() {
    const feedbacks = await this.feedbacksService.findAll();
    return { feedbacks }
  }

  @Get('/create')
  @Render('feedbacks/create')
  async showCreateForm() {
    return { }
  }

  @Post('/create')
  @Redirect('/feedbacks')
  async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbacksService.create(createFeedbackDto);
  }

  @Get('/:id/edit')
  @Render('feedbacks/edit')
  async showEditForm(@Param('id') id: number) {
    const feedback = await this.feedbacksService.findOne(id)
    return { feedback };
  }

  @Post('/:id/edit')
  @Redirect('/feedbacks')
  edit(@Param('id') id: number, @Body() updateFeedbackDto: UpdateFeedbackDto, @Req() req: Request) {
    return this.feedbacksService.update(id, updateFeedbackDto);
  }

  @Get('/:id/delete')
  @Redirect('/feedbacks')
  async remove(@Param('id') id: number) {
    return this.feedbacksService.remove(id);
  }

  @Get('/:id/detail')
  @Render('feedbacks/detail')
  async detail(@Param('id') id: number) {
    const feedback = await this.feedbacksService.findOne(id)
    return { feedback };
  }
}
