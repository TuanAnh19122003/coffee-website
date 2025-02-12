import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/database/entities/category.entity';
import { cursorTo } from 'readline';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoriesRepository : Repository<Category>
  ){}

  async findAll(page: number, limit: number) {
    const [categories, totalItems] = await this.categoriesRepository.findAndCount({
      skip: (page - 1) * limit,  
      take: limit,  
    });
    return {
      categories,
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
    }
  }
  async getAll() {
    return await this.categoriesRepository.find();
  }  
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category);      
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: {id} });
    if(!category){
      throw new NotFoundException(`Category with id ${id} not Found`)
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category>{
    const category = await this.findOne(id);
    if(!category){
      throw new NotFoundException(`Category with id ${id} not Found`)
    }
    await this.categoriesRepository.update(id, updateCategoryDto);
    return {...category,...updateCategoryDto};
  }

  async remove(id: number): Promise<void> {
    await this.categoriesRepository.delete(id);
  }
}
