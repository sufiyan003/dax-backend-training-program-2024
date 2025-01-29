import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // Create a new product
  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(data);
    return await this.productRepo.save(product);
  }

  // Find all products
  async findAll(): Promise<Product[]> {
    return await this.productRepo.find();
  }

  // Find a product by its ID
  async findById(id: number): Promise<Product | null> {
    return await this.productRepo.findOne({ where: { id } });
  }

  // Update a product by its ID
  async updateById(id: number, data: Partial<Product>): Promise<Product | null> {
    await this.productRepo.update(id, data);
    return this.findById(id);
  }

  // Delete a product by its ID
  async deleteById(id: number): Promise<void> {
    await this.productRepo.delete(id);
  }
}
