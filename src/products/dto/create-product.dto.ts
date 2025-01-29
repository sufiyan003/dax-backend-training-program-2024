import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  isAvailable: boolean;
}
