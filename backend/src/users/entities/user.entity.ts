import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "nvarchar" })
    firstName?: string;

    @Column({ type: "nvarchar" })
    lastName?: string;

    @Column({ unique: true })
    email?: string;
    
    @Column({ type: "nvarchar", length: 255, nullable: true })
    image?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    address?: string;

    @Column()
    password?: string;

    @ManyToOne(() => Role, role => role.users)
    role?: Role;

    
    @OneToMany(() => Order, order => order.user)
    orders?: Order[];
}
