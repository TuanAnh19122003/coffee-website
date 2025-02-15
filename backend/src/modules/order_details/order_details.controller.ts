import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, Redirect } from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';
import { Format } from 'src/utils/format';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Get()
  @Render('order-details/list')
  async getAllOrder(@Query('page') page: string = '1') {
    const currentPage = parseInt(page, 10) || 1;
    const limit = 5;
    const { orderDetails, totalItems } = await this.orderDetailsService.findAll(currentPage, limit);

    return {
      orderDetails,
      currentPage,
      itemsPerPage: limit,
      totalItems,
    };
  }

  @Get('/create')
  @Render('order-details/create')
  async showCreateForm() {
    const products = await this.orderDetailsService.getAllProduct()
    const orders = await this.orderDetailsService.getAllOrder()
    return { products, orders }
  }

  @Post('/create')
  @Redirect('/order-details')
  async create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
    return await this.orderDetailsService.create(createOrderDetailDto);
  }
  @Get('/:id/edit')
  @Render('order-details/edit')
  async showEditForm(@Param('id') id: number){
    const products = await this.orderDetailsService.getAllProduct();
    const orders = await this.orderDetailsService.getAllOrder();
    const orderDetail = await this.orderDetailsService.findOne(id);
    
    return { products, orders, orderDetail };
  }

  @Post('/:id/edit')
  @Redirect('/order-details')
  async update(@Param('id') id: number, @Body() updateOrderDetailDto: UpdateOrderDetailDto) {
    return this.orderDetailsService.update(id, updateOrderDetailDto);
  }

  @Get('/:id/delete')
  @Redirect('/order-details')
  async remove(@Param('id') id: number) {
    return this.orderDetailsService.remove(id);
  }

  @Get('/:id/detail')
  @Render('order-details/detail')
  async detail(@Param('id') id:number) {
    const products = await this.orderDetailsService.getAllProduct();
    const orders = await this.orderDetailsService.getAllOrder();
    const orderDetail = await this.orderDetailsService.findOne(id);
    const price = orderDetail.price ? Number(orderDetail.price) : 0;
        const quantity = orderDetail.num ?? 1;
    if(orderDetail){
      return {
        products,
        orders,
        orderDetail: {
          ...orderDetail,
          price: orderDetail.price ? Format.formatPrice(Number(orderDetail.price)) : 'N/A',
          totalPrice: Format.formatPrice(price * quantity)
        }
      };
    }
    return { products, orders, orderDetail };
  }
}
