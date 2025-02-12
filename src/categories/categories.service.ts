import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    console.log(createCategoryDto, "payload")
    if (createCategoryDto.parentCategoryId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.parentCategoryId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

   async mapCategoriesWithSubcategories(categories: Category[]) {
    const categoryMap = new Map<string, Category>();
  
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, subCategories: [] });
    });
  
    categories.forEach((category) => {
      if (category.parentCategoryId) {
        const parentCategory = categoryMap.get(category.parentCategoryId);
        if (parentCategory) {
          parentCategory.subCategories.push(categoryMap.get(category.id));
        }
      }
    });
  
    return Array.from(categoryMap.values()).filter(
      (category) => !category.parentCategoryId
    );
  }
  

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    const mappedCategories = await this.mapCategoriesWithSubcategories(categories);
    return mappedCategories;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async delete(id: string, hardDelete: boolean): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    if (hardDelete) {
      await this.categoryRepository.delete(id);
    } else {
      await this.categoryRepository.softDelete(id);
    }
  }

  async retrieveDeleted(): Promise<Category[]> {
    return this.categoryRepository.find({
      withDeleted: true, // Fetch both soft-deleted and non-deleted records
      where: { deletedAt: Not(IsNull()) }, // Filter only deleted categories
    });
  }
}
