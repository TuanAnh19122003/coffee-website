import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from 'src/database/entities/payment.entity';
import { OrdersService } from '../orders/orders.service';
import { Format } from 'src/utils/format';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('PAYMENT_REPOSITORY')
    private readonly paymentsRepository: Repository<Payment>,
    private readonly ordersService: OrdersService,
  ) {}

  async findAll(page: number, limit: number) {
    const [payments, totalItems] = await this.paymentsRepository.findAndCount({
      skip: (page - 1) * limit,  
      take: limit,
      relations: ['order']  
    });
    return {
      payments: payments.map(payment => ({
        ...payment,
        paidAmount: payment.paidAmount ? Format.formatPrice(Number(payment.paidAmount)) : 'N/A',
      })),
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit)
    };
  }
  async getAll() {
    return await this.paymentsRepository.find();
  }
  async getAllOrder() {
    return await this.ordersService.getAll();
  }
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(createPaymentDto);
    if (createPaymentDto.orderId) {
      payment.order = await this.ordersService.findOne(createPaymentDto.orderId);
    } else{
      throw new Error("Order is required");
    }
  
    return await this.paymentsRepository.save(payment);
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: {id},
      relations:['order']
    });
    if(!payment){
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment | null> {
    const paymnet = await this.findOne(id);
    if(!paymnet){
      throw new NotFoundException(`Order Size with ID ${id} not found`);
    }
    if (updatePaymentDto.orderId) {
      paymnet.order = await this.ordersService.findOne(updatePaymentDto.orderId);
    }
    Object.assign(paymnet, updatePaymentDto);
    return await this.paymentsRepository.save(paymnet);
  }

  async remove(id: number): Promise<void> {
    await this.paymentsRepository.delete(id);
  }
}
