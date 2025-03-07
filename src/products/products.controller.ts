import { Controller, Get, Post, Body, Param, Delete, Query, Patch, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { LoggingInterceptor } from '../shared/interceptors/logging.interceptor';
import { ResponseInterceptor } from '../shared/interceptors/success-response.interceptor';
import { ApiTags, ApiQuery, ApiParam, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
@UseInterceptors(LoggingInterceptor, ResponseInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
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
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateProductDto })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft or hard delete a product' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'hardDelete', required: false, type: Boolean, example: false })
  delete(@Param('id') id: string, @Query('hardDelete') hardDelete: boolean = false) {
    return this.productsService.delete(id, hardDelete);
  }

  @Get('/deleted')
  @ApiOperation({ summary: 'Retrieve all deleted products (soft or hard delete)' })
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
