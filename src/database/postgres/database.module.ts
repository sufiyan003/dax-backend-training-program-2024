import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/product.entity';
import { Profile } from 'src/users/profile.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'dax-training-program-2025',
      entities: [Category, Product, User, Profile],
      synchronize: true,
    }),
  ],
})
export class PostgresDatabaseModule {}
