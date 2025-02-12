import { 
  Controller, Get, Post, Body, Param, Delete, Query, Patch, ParseBoolPipe, UseInterceptors 
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { LoggingInterceptor } from '../shared/interceptors/logging.interceptor';
import { ResponseInterceptor } from '../shared/interceptors/success-response.interceptor';
import { ApiTags, ApiQuery, ApiParam, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
@UseInterceptors(LoggingInterceptor, ResponseInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft or hard delete a category' })
  delete(@Param('id') id: string, @Query('hardDelete', ParseBoolPipe) hardDelete: boolean) {
    return this.categoriesService.delete(id, hardDelete);
  }

  @Get('/retrieve')
  @ApiOperation({ summary: 'Retrieve all deleted categories (soft & hard delete)' })
  retrieveDeleted() {
    return this.categoriesService.retrieveDeleted();
  }
}
