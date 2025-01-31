import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  imageUrl: string;

  @IsNotEmpty()
  subCategoryId: number;
}
