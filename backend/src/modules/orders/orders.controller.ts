import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, Redirect } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './order-status.enum';
import { Format } from 'src/utils/format';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Render('orders/list')
  async getAllOrder(@Query('page') page: string = '1') {
    const currentPage = parseInt(page, 10) || 1;
    const limit = 5;
    const { orders, totalItems } = await this.ordersService.findAll(currentPage, limit);

    return {
      orders,
      currentPage,
      itemsPerPage: limit,
      totalItems,
    };
  }
  @Get('/create')
  @Render('orders/create')
  async showCreateForm() {
    const users = await this.ordersService.getAllUser();
    return { users }
  }


  @Post('/create')
  @Redirect('/orders')
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto);
  }

  @Get('/:id/edit')
  @Render('orders/edit')
  async showEditForm(@Param('id') id: number){
    const users = await this.ordersService.getAllUser();
    const order = await this.ordersService.findOne(id);
    
    return { users, order, OrderStatus };
  }

  @Post('/:id/edit')
  @Redirect('/orders')
  async update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }
  
  @Get('/:id/delete')
  @Redirect('/orders')
  async remove(@Param('id') id: number) {
    return this.ordersService.remove(id);
  }
  
  @Get('/:id/detail')
  @Render('orders/detail')
  async detail(@Param('id') id:number) {
    const user = await this.ordersService.getAllUser();
    const order = await this.ordersService.findOne(id);
    if(order){
      return {
        user,
        order: {
          ...order,
          total: order.total ? Format.formatPrice(Number(order.total)) : 'N/A',
          order_date: order.order_date ? Format.formatDateTime(order.order_date) : null,
        }
      };
    }
    return { user, order };
  }
}
