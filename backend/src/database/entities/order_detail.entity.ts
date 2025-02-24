import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from 'src/database/entities/product.entity';
import { Order } from 'src/database/entities/order.entity';

@Entity({ name: 'order_details' })
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Order, order => order.orderDetails, { onDelete: "CASCADE" }) // ✅ Đảm bảo có quan hệ
  order: Order;

  @ManyToOne(() => Product, product => product.orderDetails, { eager: true }) // ✅ Đổi productId thành product
  product: Product;

  @Column({ type: 'nvarchar', length: 50 })
  size?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price?: number;

  @Column({ type: 'int' })
  num?: number;
}
