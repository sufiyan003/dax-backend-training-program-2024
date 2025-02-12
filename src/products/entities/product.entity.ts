import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string;

  @ManyToMany(() => Category, { eager: true, onDelete: 'CASCADE' }) 
  @JoinTable({ name: 'product_categories' })
  categories: Category[];
}
