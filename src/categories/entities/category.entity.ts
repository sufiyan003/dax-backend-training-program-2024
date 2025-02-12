import { Entity, Column, ManyToOne, OneToMany, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  parentCategoryId: string; // Added parentCategoryId column

  @ManyToOne(() => Category, (category) => category.subCategories, { nullable: true, onDelete: 'SET NULL' })
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  subCategories: Category[];
}
