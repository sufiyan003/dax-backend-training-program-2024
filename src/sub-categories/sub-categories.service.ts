import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id: createSubCategoryDto.categoryId } });
    if (!category) throw new Error('Category not found');
    
    const subCategory = this.subCategoryRepository.create({ ...createSubCategoryDto, category });
    return this.subCategoryRepository.save(subCategory);
  }

  findAll() {
    return this.subCategoryRepository.find({ relations: ['category'] });
  }

  findOne(id: number) {
    return this.subCategoryRepository.findOne({ where: { id }, relations: ['category'] });
  }

  async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryRepository.findOne({ where: { id } });
    if (!subCategory) throw new Error('SubCategory not found');
    
    return this.subCategoryRepository.update(id, updateSubCategoryDto);
  }

  remove(id: number) {
    return this.subCategoryRepository.delete(id);
  }
}
