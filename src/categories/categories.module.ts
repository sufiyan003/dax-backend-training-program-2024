import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { AuthModule } from '../auth/auth.module'; // ✅ Import AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    AuthModule, // ✅ Ensure AuthModule is imported
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
