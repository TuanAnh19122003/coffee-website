import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';
import { OrderDetail } from 'src/database/entities/order_detail.entity';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { Format } from 'src/utils/format';

@Injectable()
export class OrderDetailsService {
  constructor(
    @Inject('ORDER_DETAIL_REPOSITORY')
    private readonly orderDetailsRepository: Repository<OrderDetail>,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ){}
  async findAll(page: number, limit: number) {
    const [orderDetails, totalItems] = await this.orderDetailsRepository.findAndCount({
      skip: (page - 1) * limit,  
      take: limit,
      relations: ['order', 'product', 'order.user'],
    });
    return {
      orderDetails: orderDetails.map(orderDetail => {
        const price = orderDetail.price ? Number(orderDetail.price) : 0;
        const quantity = orderDetail.num ?? 1; // Nếu `num` không có thì mặc định là 1
        return {
          ...orderDetail,
          price: Format.formatPrice(price),
          totalPrice: Format.formatPrice(price * quantity) // Tính tổng tiền từng chi tiết đơn hàng
        };
      }),
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
    };
  }
  async getAll() {
    return await this.orderDetailsRepository.find();
  }
  async getAllProduct() {
    return await this.productsService.getAll();
  }
  async getAllOrder() {
    return await this.ordersService.getAll();
  }
  async findOne(id: number): Promise<OrderDetail> {
    const orderDetail = await this.orderDetailsRepository.findOne({
      where: {id},
      relations: ['order', 'product', 'order.user'],
    });
    if(!orderDetail){
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return orderDetail;
  }

  async create(createOrderDetailDto: CreateOrderDetailDto): Promise<OrderDetail> {
    const orderDetail = this.orderDetailsRepository.create(createOrderDetailDto);
    if (createOrderDetailDto.productId) {
      orderDetail.product = await this.productsService.findOne(createOrderDetailDto.productId);
    } else{
      throw new Error("productId is required");
    }

    if (createOrderDetailDto.orderId) {
      const order = await this.ordersService.findOne(createOrderDetailDto.orderId);
      if (!order) {
        throw new NotFoundException(`Order with ID ${createOrderDetailDto.orderId} not found`);
      }
      orderDetail.order = order;
    } else {
      throw new Error("orderId is required");
    }
  
    return await this.orderDetailsRepository.save(orderDetail);
  }

  async update(id: number,updateOrderDetailDto: UpdateOrderDetailDto): Promise<OrderDetail | null> {
    const orderDetail = await this.findOne(id);
    if(!orderDetail){
      throw new NotFoundException(`Order Size with ID ${id} not found`);
    }
    if (updateOrderDetailDto.productId) {
      orderDetail.product = await this.productsService.findOne(updateOrderDetailDto.productId);
    }

    if (updateOrderDetailDto.orderId) {
      orderDetail.order = await this.ordersService.findOne(updateOrderDetailDto.orderId);
    }
    
    Object.assign(orderDetail, updateOrderDetailDto);
    return await this.orderDetailsRepository.save(orderDetail);
  }

  async remove(id: number): Promise<void> {
    await this.orderDetailsRepository.delete(id);
  }
}
