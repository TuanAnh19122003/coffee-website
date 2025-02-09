import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { ProductSize } from 'src/product_sizes/entities/product_size.entity';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount?: number;

    @Column({ type: "nvarchar", length: 255, nullable: true })
    image?: string;

    @Column({ type: "nvarchar", length: 500, nullable: true })
    description?: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt?: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt?: Date;

    @ManyToOne(() => Category, category => category.products)
    category?: Category;

    @OneToMany(() => ProductSize, productSize => productSize.product)
    sizes?: ProductSize[];
}
