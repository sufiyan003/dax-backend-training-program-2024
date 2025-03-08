import { Controller, Get, Post, Body, Param, Delete, Query, Patch, ParseBoolPipe, UseInterceptors, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { LoggingInterceptor } from '../shared/interceptors/logging.interceptor';
import { ResponseInterceptor } from '../shared/interceptors/success-response.interceptor';
import { ApiTags, ApiQuery, ApiParam, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { IsAdmin, Public } from 'src/decorators/is-roles.decorator';

@ApiTags('Categories')
@Controller('categories')
@UseInterceptors(LoggingInterceptor, ResponseInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard) // Require authentication
  @ApiBearerAuth() // Show auth requirement in Swagger
  @IsAdmin() // Restrict access to admins only
  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Public() // Allow public access
  @ApiOperation({ summary: 'Get all categories (Public)' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Public() // Allow public access
  @ApiOperation({ summary: 'Get a category by ID (Public)' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard) // Require authentication
  @ApiBearerAuth()
  @IsAdmin() // Restrict to admins
  @ApiOperation({ summary: 'Update a category by ID (Admin only)' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard) // Require authentication
  @ApiBearerAuth()
  @IsAdmin() // Restrict to admins
  @ApiOperation({ summary: 'Soft or hard delete a category (Admin only)' })
  delete(@Param('id') id: string, @Query('hardDelete', ParseBoolPipe) hardDelete: boolean) {
    return this.categoriesService.delete(id, hardDelete);
  }

  @Get('/retrieve')
  @UseGuards(AuthGuard) // Require authentication
  @ApiBearerAuth()
  @IsAdmin() // Restrict to admins
  @ApiOperation({ summary: 'Retrieve all deleted categories (Admin only)' })
  retrieveDeleted() {
    return this.categoriesService.retrieveDeleted();
  }
}
