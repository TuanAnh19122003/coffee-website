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

  async findAll(page: number, limit: number) {
    const [ product_sizes, totalItems ]  = await this.productSizesRepository.findAndCount({
      skip: (page - 1) * limit,  
      take: limit,
      relations: ['product']
    });
    return {
      product_sizes: product_sizes.map(product_size => ({
        ...product_size,
        price: product_size.price ? Format.formatPrice(Number(product_size.price)) : 'N/A',
      })),
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit)
    };
  }
  async getAllProduct(){
    return await this.productsService.getAll();
  }
  async getAll() {
    return await this.productSizesRepository.find();
  }
  async getAllProductSize(){
    const product_sizes = await this.productSizesRepository.find({
      relations: ['product'], 
    });
    return product_sizes.map((product_size) => {
      const discount = product_size.product?.discount || 0; 
      const priceProduct = Number(product_size.price) * (1 - discount / 100); 
      return {
        ...product_size,
        priceProduct: priceProduct.toFixed(2),
        price: product_size.price ? Format.formatPrice(Number(product_size.price)) : 'N/A',
        size: product_size.size,
        productId: product_size.product?.id,
      };
    });
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
