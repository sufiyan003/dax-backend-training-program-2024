import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
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
