import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Role } from 'src/database/entities/role.entity';
import { Order } from 'src/database/entities/order.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "nvarchar", nullable: false })
    firstName: string;

    @Column({ type: "nvarchar", nullable: false })
    lastName: string;

    @Column({ type: "nvarchar", nullable: false })
    email: string;
    
    @Column({ type: "nvarchar", length: 255, nullable: true })
    image?: string;

    @Column({ type: "nvarchar", nullable: true })
    phone?: string;

    @Column({ type: "nvarchar", nullable: true })
    address?: string;

    @Column({ nullable: false })
    password: string;

    @ManyToOne(() => Role, role => role.users, { nullable: false })
    role: Role;
    
    @OneToMany(() => Order, order => order.user)
    orders?: Order[];
}
