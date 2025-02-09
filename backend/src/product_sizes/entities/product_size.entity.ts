import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "src/products/entities/product.entity";

@Entity({ name: "product_sizes" })
export class ProductSize {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    size?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price?: number;

    @ManyToOne(() => Product, product => product.sizes)
    product?: Product;
}
