import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, Redirect } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Format } from 'src/utils/format';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @Render('payments/list')
  async getAllOrder(@Query('page') page: string = '1') {
    const currentPage = parseInt(page, 10) || 1;
    const limit = 5;
    const { payments, totalItems } = await this.paymentsService.findAll(currentPage, limit);

    return {
      payments,
      currentPage,
      itemsPerPage: limit,
      totalItems,
    };
  }

  @Get('/create')
  @Render('payments/create')
  async showCreateForm() {
    const orders = await this.paymentsService.getAllOrder();
    return { orders }
  }

  @Post('/create')
  @Redirect('/payments')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    await this.paymentsService.create(createPaymentDto);
  }

  @Get('/:id/edit')
  @Render('payments/edit')
  async showEditForm(@Param('id') id: number){
    const orders = await this.paymentsService.getAllOrder();
    const payment = await this.paymentsService.findOne(id);
    
    return { orders, payment };
  }

  @Post('/:id/edit')
  @Redirect('/payments')
  async update(@Param('id') id: number, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Get('/:id/delete')
  @Redirect('/payments')
  async remove(@Param('id') id: number) {
    return this.paymentsService.remove(id);
  }

  @Get('/:id/detail')
  @Render('payments/detail')
  async detail(@Param('id') id:number) {
    const order = await this.paymentsService.getAllOrder();
    const payment = await this.paymentsService.findOne(id);
    if(payment){
      return {
        order,
        payment: {
          ...payment,
          paidAmount: payment.paidAmount ? Format.formatPrice(Number(payment.paidAmount)) : 'N/A',
        }
      };
    }
    return { payment, order };
  }
}
