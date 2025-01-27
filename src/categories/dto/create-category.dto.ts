// constructor(data: { name: string; age: number }) {
//   this.name = data.name;
//   this.age = data.age;
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// TODO: Validation is not working (fix it)
export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  title: string;
}
