import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In, Not, IsNull } from 'typeorm';
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
      ? await this.getCategoriesWithSubcategories(createProductDto.categories)
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

    // Map categories with subcategories inside each product
    const productsWithSubcategories = products.map((product) => ({
      ...product,
      categories: this.mapCategoriesWithSubcategories(product.categories),
    }));

    return { total, products: productsWithSubcategories };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    return {
      ...product,
      categories: this.mapCategoriesWithSubcategories(product.categories),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.categories) {
      product.categories = await this.getCategoriesWithSubcategories(updateProductDto.categories);
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async delete(id: string, hardDelete: boolean): Promise<{ message: string }> {
    await this.findOne(id);

    if (hardDelete) {
      await this.productRepository.delete(id);
      return { message: `Product with ID ${id} has been permanently deleted.` };
    } else {
      await this.productRepository.softDelete(id);
      return { message: `Product with ID ${id} has been soft deleted.` };
    }
  }

  async getDeleted(type: 'soft' | 'hard', page: number, limit: number) {
    const whereCondition = type === 'soft' ? { deletedAt: Not(IsNull()) } : {};
    const withDeleted = type === 'soft';

    const [deletedProducts, total] = await this.productRepository.findAndCount({
      where: whereCondition,
      withDeleted,
      take: limit,
      skip: (page - 1) * limit,
      relations: ['categories'],
    });

    // Map categories with subcategories inside deleted products
    const deletedProductsWithSubcategories = deletedProducts.map((product) => ({
      ...product,
      categories: this.mapCategoriesWithSubcategories(product.categories),
    }));

    return { total, deletedProducts: deletedProductsWithSubcategories };
  }

  // ========================
  // Helper Functions
  // ========================

  async getCategoriesWithSubcategories(categoryIds: string[]): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      where: { id: In(categoryIds) },
      relations: ['parentCategory'],
    });

    return this.mapCategoriesWithSubcategories(categories);
  }

  mapCategoriesWithSubcategories(categories: Category[]): Category[] {
    const categoryMap = new Map<string, Category>();

    // Create map of categories with empty subCategories array
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, subCategories: [] });
    });

    // Assign subcategories to their parent categories
    categories.forEach((category) => {
      if (category.parentCategoryId) {
        const parentCategory = categoryMap.get(category.parentCategoryId);
        if (parentCategory) {
          parentCategory.subCategories.push(categoryMap.get(category.id));
        }
      }
    });

    // Return only top-level categories (without parent)
    return Array.from(categoryMap.values()).filter((category) => !category.parentCategoryId);
  }
}
