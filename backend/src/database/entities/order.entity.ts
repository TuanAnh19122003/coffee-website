import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { OrderDetail } from 'src/database/entities/order_detail.entity';
import { OrderStatus } from 'src/modules/orders/order-status.enum';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (user) => user.orders)
  user?: User;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  note?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total?: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status?: OrderStatus;

  @CreateDateColumn({ type: 'timestamp' })
  order_date?: Date;

  @OneToMany(() => OrderDetail, (orderDetails) => orderDetails.order)
  orderDetails?: OrderDetail[];
}
