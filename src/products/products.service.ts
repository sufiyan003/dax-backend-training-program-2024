import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SubCategory } from '../sub-categories/entities/sub-category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const subCategory = await this.subCategoryRepository.findOne({ where: { id: createProductDto.subCategoryId } });
    if (!subCategory) throw new Error('SubCategory not found');

    const product = this.productRepository.create({ ...createProductDto, subCategory });
    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({ relations: ['subCategory'] });
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id }, relations: ['subCategory'] });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
