import { IsString, IsNotEmpty, IsOptional, IsUUID, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Smartphone', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Latest smartphone with high-end specs', description: 'Product description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 599.99, description: 'Price of the product' })
  @Transform(({ value }) => parseFloat(value))  // Converts string to number
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'https://example.com/product-image.jpg', description: 'Image URL of the product', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'SKU12345', description: 'Stock Keeping Unit (SKU) for the product, unique identifier for inventory' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ 
    example: ['123e4567-e89b-12d3-a456-426614174000', '987e6543-e21b-45d1-b987-876543210000'], 
    description: 'Array of category IDs this product belongs to. Must be valid UUIDs.', 
    required: false 
  })
  @IsArray()
  @IsOptional()
  categories?: string[];
}
