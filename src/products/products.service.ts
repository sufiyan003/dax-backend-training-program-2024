import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/entities/category.entity';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    
    const categories = createProductDto.categories
      ? await this.categoryRepository.find({
          where: { id: In(createProductDto.categories) },
        })
      : [];

    const product = this.productRepository.create({
      ...createProductDto,
      categories, 
    });

    return this.productRepository.save(product);
  }

  async findAll(page: number, limit: number, search?: string) {
    const [products, total] = await this.productRepository.findAndCount({
      where: search ? { name: ILike(`%${search}%`) } : {},
      take: limit,
      skip: (page - 1) * limit,
      relations: ['categories'], 
    });

    return { total, products };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'], 
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async softDelete(id: string): Promise<void> {
    await this.productRepository.softDelete(id);
  }
}
