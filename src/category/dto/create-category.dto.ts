import { IsNotEmpty, IsString } from 'class-validator';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  category: Category;
}
