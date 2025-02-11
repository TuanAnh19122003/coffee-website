import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/database/entities/product.entity';

@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column({ type: "nvarchar", length: 255 })
    name?: string;
  
    @OneToMany(() => Product, product => product.category)
    products?: Product[];
}
