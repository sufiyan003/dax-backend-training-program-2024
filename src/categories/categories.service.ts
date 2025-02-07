import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoryRepo: Repository<Category>) {}

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepo.create(dto);
    if (dto.parentCategoryId) {
      category.parentCategory = await this.categoryRepo.findOne({ where: { id: dto.parentCategoryId } });
    }
    return this.categoryRepo.save(category);
  }

  async findAll(page: number, limit: number) {
    const [data, total] = await this.categoryRepo.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['subCategories', 'parentCategory'],
    });

    return { data, total };
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id }, relations: ['subCategories', 'parentCategory'] });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.categoryRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.categoryRepo.softDelete(id);
    return { message: 'Category deleted successfully' };
  }
}
