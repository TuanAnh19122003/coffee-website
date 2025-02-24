import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from 'src/database/entities/order.entity';
import { UsersService } from '../users/users.service';
import { Format } from 'src/utils/format';
import { OrderStatus } from './order-status.enum';
import { OrderDetail } from 'src/database/entities/order_detail.entity';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly ordersRepository: Repository<Order>,

    @Inject('ORDER_DETAIL_REPOSITORY')
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly usersService: UsersService,
  ) { }
  async findAll(page: number, limit: number) {
    const [orders, totalItems] = await this.ordersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });
    return {
      orders: orders.map((order) => ({
        ...order,
        order_date: order.order_date
          ? Format.formatDateTime(order.order_date)
          : null,
        total: order.total ? Format.formatPrice(Number(order.total)) : 'N/A',
      })),
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
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
    } else {
      throw new Error('userId is required');
    }

    return await this.ordersRepository.save(order);
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order | null> {
    const order = await this.findOne(id);
    if (!order) {
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


  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      console.log("📥 Dữ liệu đơn hàng nhận được:", createOrderDto);
      const { userId, address, note, orderDetails, status } = createOrderDto;

      if (!userId) {
        throw new Error("Thiếu userId");
      }

      for (const item of orderDetails) {
        if (!item.productId || !item.price || !item.num) {
          throw new Error("Danh sách sản phẩm có dữ liệu không hợp lệ");
        }
      }

      let totalAmount = 0;
      const orderItems: OrderDetail[] = [];

      const newOrder = this.ordersRepository.create({
        user: { id: Number(userId) },
        address,
        note,
        total: 0,
        status: status || OrderStatus.PENDING,
        order_date: new Date(),
      });

      const savedOrder = await this.ordersRepository.save(newOrder);
      //console.log("Đơn hàng đã lưu vào database:", savedOrder);

      for (const item of orderDetails) {
        totalAmount += item.price * item.num;

        const orderItem = this.orderDetailRepository.create({
          order: savedOrder,
          product: { id: item.productId },
          size: item.size,
          price: item.price,
          num: item.num,
        });

        //console.log("Tạo chi tiết đơn hàng:", orderItem);

        await this.orderDetailRepository.save(orderItem);
        orderItems.push(orderItem);
      }

      savedOrder.total = totalAmount;
      savedOrder.orderDetails = orderItems;

      //console.log("Cập nhật tổng tiền đơn hàng:", savedOrder);

      return await this.ordersRepository.save(savedOrder);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      throw new Error(`Lỗi khi tạo đơn hàng: ${error.message}`);
    }
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    order.status = status;
    return this.ordersRepository.save(order);
  }

}
