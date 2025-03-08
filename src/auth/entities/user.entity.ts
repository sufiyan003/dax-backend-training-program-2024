import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';

@Entity()
export class User extends BaseEntity  {

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phoneNo?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ default: false })
  isVerified?: boolean;

  @Column({ default: false })
  isAdmin: boolean;
 
}
