import { Module, Provider, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { APP_PIPE } from '@nestjs/core';

const providers: Provider[] = [
  {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },
];

@Module({
  providers: [...providers, AppService],
  imports: [MoviesModule],
  controllers: [AppController],
})
export class AppModule {}
