import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect } from '@nestjs/common';
import { ProductSizesService } from './product_sizes.service';
import { CreateProductSizeDto } from './dto/create-product_size.dto';
import { UpdateProductSizeDto } from './dto/update-product_size.dto';
import { ProductSize } from 'src/database/entities/product_size.entity';
import { Format } from 'src/utils/format';

@Controller('product-sizes')
export class ProductSizesController {
  constructor(private readonly productSizesService: ProductSizesService) {}

  @Get()
  @Render('product-sizes/list')
  async getAllProductSize() {
    const product_sizes = await this.productSizesService.findAll();
    return { product_sizes };
  }

  @Get('/create')
  @Render('product-sizes/create')
  async showCreateForm(){
    const products = await this.productSizesService.getAllProduct();
    return { products };
  }


  @Post('/create')
  @Redirect('/product-sizes')
  create(@Body() createProductSizeDto: CreateProductSizeDto) {
    return this.productSizesService.create(createProductSizeDto);
  }

  @Get('/:id/edit')
  @Render('product-sizes/edit')
  async showEditForm(@Param('id') id: number){
    const products = await this.productSizesService.getAllProduct();
    const product_size = await this.productSizesService.findOne(id)
    return { products, product_size };
  }

  @Post('/:id/edit')
  @Redirect('/product-sizes')
  async update(@Param('id') id: number, @Body() updateProductSizeDto: UpdateProductSizeDto) {
    return this.productSizesService.update(id, updateProductSizeDto);
  }

  @Get('/:id/delete')
  @Redirect('/product-sizes')
  async remove(@Param('id') id: number) {
    return this.productSizesService.remove(id);
  }

  @Get('/:id/detail')
  @Render('product-sizes/detail')
  async detail(@Param('id') id:number) {
    const products = await this.productSizesService.getAllProduct();
    const product_size = await this.productSizesService.findOne(id);
    if(product_size){
      return {
        products,
        product_size: {
          ...product_size,
          price: product_size.price ? Format.formatPrice(Number(product_size.price)) : 'N/A',
        }
      };
    }
    return { products, product_size };
  }
}
