import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppRepository } from './app.repository';
import { CategoriesModule } from './categories/categories.module';
import { PostgresDatabaseModule } from './database/postgres/database.module';

@Module({
  imports: [PostgresDatabaseModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService, AppRepository],
})
export class AppModule {}
