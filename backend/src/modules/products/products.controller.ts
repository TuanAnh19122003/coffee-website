import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, Render, UseInterceptors, Redirect, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Format } from 'src/utils/format';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Render('products/list')
  async getAllProduct(@Query('page') page: string = '1') {
    const currentPage = parseInt(page, 10) || 1;
    const limit = 5;
    const { products, totalItems } = await this.productsService.findAll(currentPage, limit);

    return {
      products,
      currentPage,
      itemsPerPage: limit,
      totalItems,
    };
  }

  @Get('/create')
  @Render('products/create')
  async showCreateForm() {
    const categories = await this.productsService.getAllCategory();
    return { categories }
  }

  @Post('/create')
  @Redirect('/products')
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createProductDto: CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
    if(file){
      createProductDto.image = `/uploads/${file.filename}`;
    }
    //console.log(file)
    return this.productsService.create(createProductDto);
  }

  @Get('/:id/edit')
  @Render('products/edit')
  async showEditForm(@Param('id') id:number) {
    const categories = await this.productsService.getAllCategory();
    const product = await this.productsService.findOne(id)
    return { categories, product };
  }

  @Post('/:id/edit')
  @Redirect('/products')
  @UseInterceptors(FileInterceptor('image'))
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto, @UploadedFile() file: Express.Multer.File) {
    return await this.productsService.update(id, updateProductDto, file);
  }

  @Get('/:id/delete')
  @Redirect('/products')
  async remove(@Param('id') id: number) {
    return this.productsService.remove(+id);
  }

  @Get('/:id/detail')
  @Render('products/detail')
  async detail(@Param('id') id:number) {
    const categories = await this.productsService.getAllCategory();
    const product = await this.productsService.findOne(id);
    if(product){
      return {
        categories,
        product: {
          ...product,
          createdAt: product.createdAt ? Format.formatDateTime(product.createdAt) : 'N/A',
          updatedAt: product.updatedAt ? Format.formatDateTime(product.updatedAt) : 'N/A',
        }
      };
    }
    return { categories, product };
  }
}
