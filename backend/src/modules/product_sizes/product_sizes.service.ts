import { Injectable } from '@nestjs/common';
import { CreateProductSizeDto } from './dto/create-product_size.dto';
import { UpdateProductSizeDto } from './dto/update-product_size.dto';

@Injectable()
export class ProductSizesService {
  create(createProductSizeDto: CreateProductSizeDto) {
    return 'This action adds a new productSize';
  }

  findAll() {
    return `This action returns all productSizes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productSize`;
  }

  update(id: number, updateProductSizeDto: UpdateProductSizeDto) {
    return `This action updates a #${id} productSize`;
  }

  remove(id: number) {
    return `This action removes a #${id} productSize`;
  }
}
