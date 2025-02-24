import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from 'src/database/entities/payment.entity';
import { OrdersService } from '../orders/orders.service';
import { Format } from 'src/utils/format';
import * as crypto from 'crypto';
import axios from 'axios';

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
      relations: ['order'],
    });
    return {
      payments: payments.map((payment) => ({
        ...payment,
        paidAmount: payment.paidAmount
          ? Format.formatPrice(Number(payment.paidAmount))
          : 'N/A',
      })),
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
    };
  }
  async getAll() {
    return await this.paymentsRepository.find();
  }
  async getAllOrder() {
    return await this.ordersService.getAll();
  }
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    console.log('Received payment data:', createPaymentDto); // Kiểm tra dữ liệu gửi lên
  
    if (!createPaymentDto.orderId) {
      throw new Error('Order ID is required for payment');
    }
  
    const order = await this.ordersService.findOne(createPaymentDto.orderId);
    console.log('Found order:', order); // Kiểm tra xem order có tồn tại không
  
    if (!order) {
      throw new NotFoundException(
        `Order with ID ${createPaymentDto.orderId} not found`,
      );
    }
    console.log('🔹 [DEBUG] Order Total:', order.total);
  
    const payment = this.paymentsRepository.create({
      ...createPaymentDto,
      order,
      paidAmount: order.total,
    });
  
    console.log('Created payment entity:', payment);
  
    return await this.paymentsRepository.save(payment);
  }
  

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment | null> {
    const payment = await this.findOne(id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Nếu có orderId, tìm lại order mới
    if (updatePaymentDto.orderId) {
      payment.order = await this.ordersService.findOne(
        updatePaymentDto.orderId,
      );
      if (!payment.order) {
        throw new NotFoundException(
          `Order with ID ${updatePaymentDto.orderId} not found`,
        );
      }
    }

    // Cập nhật số tiền từ order
    if (payment.order) {
      payment.paidAmount = payment.order.total;
    }

    Object.assign(payment, updatePaymentDto);
    return await this.paymentsRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    await this.paymentsRepository.delete(id);
  }
}
