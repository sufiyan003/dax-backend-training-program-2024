import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { AuthModule } from '../auth/auth.module'; // ✅ Import AuthModule for authentication
import { AuthGuard } from '../auth/auth.guard'; // ✅ Import AuthGuard
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    AuthModule, // ✅ Ensure AuthModule is imported
  ],
  controllers: [ProductsController],
  providers: [ProductsService, JwtService, AuthGuard], // ✅ Provide AuthGuard and JwtService
  exports: [ProductsService], // ✅ Export ProductsService if needed elsewhere
})
export class ProductsModule {}
