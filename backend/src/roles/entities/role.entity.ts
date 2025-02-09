import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type:'nvarchar', length:225 })
    name: string;

    @OneToMany(() => User, user => user.role)
    users?: User[];
}
