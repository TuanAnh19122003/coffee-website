import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from 'src/database/entities/order.entity';
import { UsersService } from '../users/users.service';
import { Format } from 'src/utils/format';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
  ){}
  async findAll(page: number, limit: number) {
    const [orders, totalItems] = await this.ordersRepository.findAndCount({
      skip: (page - 1) * limit,  
      take: limit,
      relations: ['user']  
    });
    return {
      orders: orders.map(order => ({
        ...order,
        order_date: order.order_date ? Format.formatDateTime(order.order_date) : null,
        total: order.total ? Format.formatPrice(Number(order.total)) : 'N/A',
      })),
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit)
    };
  }
  async getAll() {
    return await this.ordersRepository.find();
  }
  async getAllUser() {
    return await this.usersService.getAll();
  }
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create(createOrderDto);
    if (createOrderDto.userId) {
      order.user = await this.usersService.findOne(createOrderDto.userId);
    } else{
      throw new Error("userId is required");
    }
  
    return await this.ordersRepository.save(order);
  }


  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: {id},
      relations:['user']
    });
    if(!order){
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order | null> {
    const order = await this.findOne(id);
    if(!order){
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    if (updateOrderDto.userId) {
      order.user = await this.usersService.findOne(updateOrderDto.userId);
    }
    Object.assign(order, updateOrderDto);
    return await this.ordersRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepository.delete(id);
  }
}
