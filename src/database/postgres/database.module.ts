import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity'; // Assuming the Category entity exists
import { Product } from 'src/products/entities/product.entity'; // Updated import path for Product entity
import { ProductsModule } from 'src/products/products.module'; // Ensure this path matches your structure

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'dax-training-program-2025',
      entities: [Category, Product], // Make sure Product is included
      synchronize: true, // Use only in development
    }),
    ProductsModule, // Ensure ProductModule is correctly imported
  ],
})
export class PostgresDatabaseModule {}
