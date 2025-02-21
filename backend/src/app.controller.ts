import { Controller, Get, Render, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getAdminDashboard(@Req() req: any) {
    return { message: 'Welcome to the Admin Dashboard', user: req.session.user };
  }
}
