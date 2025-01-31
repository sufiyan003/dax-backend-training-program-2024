import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true, nullable: false })
  slug: string;

  @Column()
  title: string;

  @ManyToOne(() => Category, (category) => category.childCategories)
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  childCategories: Category[];

  @CreateDateColumn()
  @Exclude()
  public createdAt?: Date;

  @UpdateDateColumn()
  @Exclude()
  public updatedAt?: Date;

  @DeleteDateColumn()
  @Exclude()
  public deletedAt?: Date;
}
