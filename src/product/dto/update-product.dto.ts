import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.enum';
import { IsArray, IsEnum, ArrayNotEmpty } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Category, { each: true })
  @ApiProperty({
    description: '수정할 상품 카테고리 배열',
    type: 'array',
    items: {
      type: 'string',
      enum: Object.values(Category),
    },
    example: ['COMPUTER', 'ELECTRONICS'],
    required: false,
  })
  categories: Category[];
}
