import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, CategoriesModule, SubCategoriesModule, ProductsModule],
})
export class AppModule {}
