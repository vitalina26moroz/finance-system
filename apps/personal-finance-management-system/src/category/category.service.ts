import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from '../../../../libs/db/src/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    id: string,
  ): Promise<Category> {
    const isExist = await this.categoryRepository.findBy({
      user: { id },
      category_name: createCategoryDto.category_name,
    });

    if (isExist.length)
      throw new BadRequestException('This category already exist!');

    const newCategory = {
      category_name: createCategoryDto.category_name,
      transaction_type: createCategoryDto.transaction_type,
      description: createCategoryDto.description
        ? createCategoryDto.description
        : '',
      user: {
        id,
      },
    };

    return await this.categoryRepository.save(newCategory);
  }

  async findAll(id: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: {
        user: { id },
      },
      relations: {
        transactions: true,
      },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        user: true,
        transactions: true,
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) throw new NotFoundException('Category not found!');
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) throw new NotFoundException('Category not found!');

    return await this.categoryRepository.delete(id);
  }
}
