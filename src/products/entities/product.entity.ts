import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SubCategory } from '../../sub-categories/entities/sub-category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => SubCategory, subCategory => subCategory.id, { onDelete: 'CASCADE' })
  subCategory: SubCategory;
}
