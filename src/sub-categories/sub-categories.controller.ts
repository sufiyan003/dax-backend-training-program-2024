import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategoriesService } from './sub-categories.service';

@ApiTags('sub-categories')
@Controller('sub-categories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sub-category' })
  @ApiResponse({ status: 201, description: 'Sub-category successfully created.' })
  create(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoriesService.create(createSubCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sub-categories' })
  @ApiResponse({ status: 200, description: 'List of sub-categories retrieved.' })
  findAll() {
    return this.subCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sub-category by ID' })
  @ApiResponse({ status: 200, description: 'Sub-category retrieved.' })
  @ApiParam({ name: 'id', description: 'Sub-category ID' })
  findOne(@Param('id') id: string) {
    const subCategoryId = Number(id);
    return this.subCategoriesService.findOne(subCategoryId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a sub-category' })
  @ApiResponse({ status: 200, description: 'Sub-category successfully updated.' })
  @ApiParam({ name: 'id', description: 'Sub-category ID' })
  update(@Param('id') id: string, @Body() updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategoryId = Number(id);
    return this.subCategoriesService.update(subCategoryId, updateSubCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sub-category' })
  @ApiResponse({ status: 200, description: 'Sub-category successfully deleted.' })
  @ApiParam({ name: 'id', description: 'Sub-category ID' })
  remove(@Param('id') id: string) {
    const subCategoryId = Number(id);
    return this.subCategoriesService.remove(subCategoryId);
  }
}
