import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Redirect,
  Query,
  Res,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Render('categories/list')
  async getAllCategory(@Query('page') page: string = '1') {
    const currentPage = parseInt(page, 10) || 1;
    const limit = 5;
    const { categories, totalItems } = await this.categoriesService.findAll(
      currentPage,
      limit,
    );

    return {
      categories,
      currentPage,
      itemsPerPage: limit,
      totalItems,
    };
  }

  @Get('/create')
  @Render('categories/create')
  async showCreateForm() {
    return {};
  }

  @Post('/create')
  @Redirect('/categories')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get('/:id/edit')
  @Render('categories/edit')
  async showEditForm(@Param('id') id: number) {
    const category = await this.categoriesService.findOne(id);
    return { category };
  }
  @Post('/:id/edit')
  @Redirect('/categories')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Get('/:id/delete')
  @Redirect('/categories')
  async remove(@Param('id') id: number) {
    return this.categoriesService.remove(+id);
  }

  @Get('/:id/detail')
  @Render('categories/detail')
  async detail(@Param('id') id: number) {
    const category = await this.categoriesService.findOne(id);
    return { category };
  }
}
