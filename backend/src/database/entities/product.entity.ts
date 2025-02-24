import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from 'src/database/entities/category.entity';
import { ProductSize } from 'src/database/entities/product_size.entity';
import { OrderDetail } from './order_detail.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount?: number;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  image?: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @ManyToOne(() => Category, (category) => category.products)
  category?: Category;

  @OneToMany(() => ProductSize, (productSize) => productSize.product)
  product_sizes?: ProductSize[];

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.product)
  orderDetails: OrderDetail[];
}
