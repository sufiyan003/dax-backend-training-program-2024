// constructor(data: { name: string; age: number }) {
//   this.name = data.name;
//   this.age = data.age;
// }

import { IsNumber, IsOptional, IsString } from 'class-validator';

// TODO: Validation is not working (fix it)
export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  age: number;
}
