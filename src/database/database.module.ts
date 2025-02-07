import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',  
      password: '1234',      
      database: 'dax_bazaar_db',
      entities: [Category, Product],
      synchronize: true, 
    }),
  ],
})
export class DatabaseModule {}
