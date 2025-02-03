import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { PostgresDatabaseModule } from './database/postgres/database.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ResponseInterceptor } from './shared/interceptors/success-response.interceptor';

@Module({
  providers: [
    AppService,
    AppRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe,
    // },
  ],
  imports: [PostgresDatabaseModule, CategoriesModule],
  controllers: [AppController],
})
export class AppModule {}
