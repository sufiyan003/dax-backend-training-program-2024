import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/application')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  get(): string {
    return this.appService.getHello();
  }

  @Post('/')
  add(): string {
    return this.appService.getHello();
  }

  @Patch('/')
  update(): string {
    return this.appService.getHello();
  }

  @Delete('/')
  delete(): string {
    return this.appService.getHello();
  }
}
