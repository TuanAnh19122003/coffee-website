import { OrderStatus } from "../order-status.enum";

export class CreateOrderDto {
    address?: string;
    note?: string;
    total: number;
    status?: OrderStatus;
    order_date?: Date;
    userId: number;
}
