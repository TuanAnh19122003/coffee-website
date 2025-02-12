import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProductSizeDto } from './dto/create-product_size.dto';
import { UpdateProductSizeDto } from './dto/update-product_size.dto';
import { ProductSize } from 'src/database/entities/product_size.entity';
import { ProductsService } from '../products/products.service';
import { Format } from 'src/utils/format';

@Injectable()
export class ProductSizesService {
  constructor(
    @Inject('PRODUCT_SIZE_REPOSITORY')
    private readonly productSizesRepository: Repository<ProductSize>,
    private readonly productsService: ProductsService,
  ){}

  async findAll() {
    const product_sizes  = await this.productSizesRepository.find({
      relations: ['product']
    });
    return product_sizes.map((product_size) => ({
      ...product_size,
      price: product_size.price ? Format.formatPrice(Number(product_size.price)) : 'N/A',
    }));
  }
  async getAllProduct(){
    return await this.productsService.findAll();
  }

  async create(createProductSizeDto: CreateProductSizeDto): Promise<ProductSize> {
    const product_size = this.productSizesRepository.create(createProductSizeDto);
    if(createProductSizeDto.productId){
      product_size.product = await this.productsService.findOne(createProductSizeDto.productId)
    }
    return await this.productSizesRepository.save(product_size);
  }

  async findOne(id: number): Promise<ProductSize> {
    const product_size = await this.productSizesRepository.findOne({
      where: {id},
      relations: ['product']
    });
    if(!product_size){
      throw new NotFoundException(`Product size witd ${id} not found`);
    }
    return product_size;
  }

  async update(id: number, updateProductSizeDto: UpdateProductSizeDto): Promise<ProductSize | null>{
    const product_size = await this.findOne(id);
    if(!product_size){
      throw new NotFoundException(`Product Size with ID ${id} not found`);
    }
    if (updateProductSizeDto.productId) {
      product_size.product = await this.productsService.findOne(updateProductSizeDto.productId);
    }
    Object.assign(product_size, updateProductSizeDto);
    return await this.productSizesRepository.save(product_size);
  }

  async remove(id: number): Promise<void> {
    await this.productSizesRepository.delete(id);
  }
}
