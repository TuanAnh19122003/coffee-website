import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/database/entities/product.entity';
import { CategoriesService } from '../categories/categories.service';
import { Format } from 'src/utils/format';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productsRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ){}

  async findAll() {
    const products =  await this.productsRepository.find({
      relations: ['category']
    });
    return products.map((product) => ({
      ...product,
      createdAt: product.createdAt ? Format.formatDateTime(product.createdAt) : null,
      updatedAt: product.updatedAt ? Format.formatDateTime(product.updatedAt) : null
    }));
  }
  async getAllCategory(){
    return await this.categoriesService.findAll();
  }

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    if(file){
      product.image = `/uploads/${file.filename}`;
    }
    if(createProductDto.categoryId){
      product.category = await this.categoriesService.findOne(createProductDto.categoryId)
    }
    return await this.productsRepository.save(product);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: {id},
      relations: ['category']
    });
    if(!product){
      throw new NotFoundException(`Product witd d ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, file?:Express.Multer.File): Promise<Product> {
    const product = await this.findOne(id)
    if(file){
      if(product.image){
        const oldImagePath = path.join(__dirname, '..', '..', '..', 'public', 'uploads', path.basename(product.image));
        //console.log("ĐƯờng dẫn ảnh cũ: "+ oldImagePath)    
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("ảnh cũ đã được xóa")
        }
      }
      product.image = `/uploads/${file.filename}`;
    }
    if (updateProductDto.categoryId) {
      product.category = await this.categoriesService.findOne(updateProductDto.categoryId);
    }
    Object.assign(product, updateProductDto);
    return await this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    if(product.image){
      const oldImagePath = path.join(__dirname, '..', '..', '..', 'public', 'uploads', path.basename(product.image));
      //console.log("ĐƯờng dẫn ảnh cũ: "+ oldImagePath)    
      if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("ảnh và thông tin của sản phẩm đã được xóa")
      }
    }
    await this.productsRepository.delete(product);
  }
}
