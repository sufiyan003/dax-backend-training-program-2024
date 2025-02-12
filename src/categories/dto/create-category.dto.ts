import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Name of the category' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Category for all electronic products', description: 'Category description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/category-image.jpg', description: 'Image URL of the category', required: false })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL format' })
  imageUrl?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Parent category ID (for subcategories)', required: false })
  @IsOptional()
  parentCategoryId?: string;
}
