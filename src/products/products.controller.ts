import { Controller, Get, Post, Body, Param, Delete, Query, Patch, UseInterceptors, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { LoggingInterceptor } from '../shared/interceptors/logging.interceptor';
import { ResponseInterceptor } from '../shared/interceptors/success-response.interceptor';
import { ApiTags, ApiQuery, ApiParam, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { IsAdmin, Public } from 'src/decorators/is-roles.decorator';

@ApiTags('Products')
@Controller('products')
@UseInterceptors(LoggingInterceptor, ResponseInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard) // Require authentication
  @ApiBearerAuth() // Show authentication in Swagger
  @IsAdmin() // Only admins can create products
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public() // Allow public access
  @ApiOperation({ summary: 'Get all products (Public)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'laptop' })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(page, limit, search);
  }

  @Get(':id')
  @Public() // Allow public access
  @ApiOperation({ summary: 'Get a product by ID (Public)' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard) // Require authentication
  @ApiBearerAuth()
  @IsAdmin() // Only admins can update products
  @ApiOperation({ summary: 'Update a product by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateProductDto })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard) // Require authentication
  @ApiBearerAuth()
  @IsAdmin() // Only admins can delete products
  @ApiOperation({ summary: 'Soft or hard delete a product (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'hardDelete', required: false, type: Boolean, example: false })
  delete(@Param('id') id: string, @Query('hardDelete') hardDelete: boolean = false) {
    return this.productsService.delete(id, hardDelete);
  }

  @Get('/deleted')
  @UseGuards(AuthGuard) // Require authentication
  @ApiBearerAuth()
  @IsAdmin() // Only admins can retrieve deleted products
  @ApiOperation({ summary: 'Retrieve all deleted products (Admin only)' })
  @ApiQuery({ name: 'type', required: false, type: String, enum: ['soft', 'hard'], example: 'soft' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  getDeleted(
    @Query('type') type: 'soft' | 'hard' = 'soft',
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this.productsService.getDeleted(type, page, limit);
  }
}
