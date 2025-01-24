import { Injectable } from '@nestjs/common';

@Injectable()
export class AppRepository {
  getData(): string {
    return 'Hello World!';
  }
}
