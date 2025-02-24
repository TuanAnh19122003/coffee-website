import { OrderStatus } from '../order-status.enum';
import { CreateOrderDetailDto } from 'src/modules/order_details/dto/create-order_detail.dto';

export class CreateOrderDto {
  address?: string;
  note?: string;
  orderDetails: CreateOrderDetailDto[];
  status?: OrderStatus;
  order_date?: Date;
  userId: number;
}
