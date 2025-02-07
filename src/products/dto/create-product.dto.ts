import { IsString, IsNotEmpty, IsOptional, IsDecimal, IsUUID, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  categories?: string[];
}
