import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/')
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // TODO: find the reson why this is not working after swap API.
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(+slug);
  }

  @Get('/trash')
  findTrash() {
    return this.categoriesService.findTrash();
  }

  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+slug, updateCategoryDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Query('type') type: 'soft' | 'hard') {
    return this.categoriesService.delete(+id, type);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.categoriesService.restore(+id);
  }
}
