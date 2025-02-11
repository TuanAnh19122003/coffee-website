import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, Render, UseInterceptors, Redirect } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  @Render('users/list')
  async getAllUser() {
    const users = await this.usersService.findAll()
    //console.log(users);
    return { users };
  }
  async getRoles() {
    return await this.usersService.getAllRoles();
  }


  @Get('/create')
  @Render('users/create')
  async showCreateForm() {
    const roles = await this.usersService.getAllRoles();
    return { roles };
  }

  @Post('/create')
  @Redirect('/users')
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createUserDto: CreateUserDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      createUserDto.image = `/uploads/${file.filename}`;
    }
    //console.log(file)
    return await this.usersService.create(createUserDto, file);
  }
  
  @Get('/:id/edit')
  @Render('users/edit')
  async showEditForm(@Param('id') id: number) {
    const roles = await this.usersService.getAllRoles();
    const user = await this.usersService.findOne(id)
    return { roles, user };
  }
  
  @Post('/:id/edit')
  @Redirect('/users')
  @UseInterceptors(FileInterceptor('image'))
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File) {
    return await this.usersService.update(id, updateUserDto, file);
  }


  @Get('/:id/delete')
  @Redirect('/users')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Get('/:id/detail')
  @Render('users/detail')
  async detail(@Param('id') id: number) {
    const user = await this.usersService.findOne(id)
    return { user };
  }

}
