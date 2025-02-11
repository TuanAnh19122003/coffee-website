import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { User } from "src/database/entities/user.entity";
import { Payment } from "src/database/entities/payment.entity";
import { OrderDetail } from "src/database/entities/order_detail.entity";

@Entity({ name: "orders" })
export class Order {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => User, user => user.orders)
    user?: User;

    @Column({ type: "nvarchar", length: 255 })
    fullname?: string;

    @Column({ type: "nvarchar", length: 255 })
    email?: string;

    @Column({ type: "nvarchar", length: 10 })
    phoneNumber?: string;

    @Column({ type: "nvarchar", length: 255 })
    address?: string;

    @Column({ type: "nvarchar", length: 500, nullable: true })
    note?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total?: number;

    @Column({ type: "int", default: 0 })
    status?: number;  // 0: pending, 1: approved

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    order_date?: Date;

    @OneToMany(() => OrderDetail, orderDetails => orderDetails.order)
    orderDetails?: OrderDetail[];

    @OneToOne(() => Payment, payment => payment.order)
    payment?: Payment;
}
