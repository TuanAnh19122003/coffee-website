import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Render('roles/list')
  async getAllRole(@Query('page') page: string = '1') {
    const currentPage = parseInt(page, 10) || 1;
    const limit = 5;
    const { roles, totalItems } = await this.rolesService.findAll(currentPage, limit);

    return {
      roles,
      currentPage,
      itemsPerPage: limit,
      totalItems,
    };
  }

  @Get('/create')
  @Render('roles/create')
  async showCreateForm() {
    return { };
  }

  @Post('/create')
  @Redirect('/roles')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get('/:id/edit')
  @Render('roles/edit')
  async showEditForm(@Param('id') id: number) {
    const role = await this.rolesService.findOne(id)
    return { role };
  }

  @Post('/:id/edit')
  @Redirect('/roles')
  edit(@Param('id') id:number, @Body() UpdateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, UpdateRoleDto);
  }

  @Get('/:id/delete')
  @Redirect('/roles')
  remove(@Param('id') id: number) {
    return this.rolesService.remove(id);
  }

  @Get('/:id/detail')
  @Render('roles/detail')
  async detail(@Param('id') id: number) {
    const role = await this.rolesService.findOne(id)
    return { role };
  }
}
