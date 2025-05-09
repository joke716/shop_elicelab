import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'iPhone 16 Pro' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'very good' })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1500000 })
  price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-model-select-gallery-1-202405?wid=5120&hei=2880&fmt=webp&qlt=70&.v=cXN0QTVTNDBtbGIzcy91THBPRThnNE5sSFgwakNWNmlhZ2d5NGpHdllWY09WV3R2ZHdZMXRzTjZIcWdMTlg4eUJQYkhSV3V1dC9oa0s5K3lqMGtUaFMvR01EVDlzK0hIS1J2bTdpY0pVeTF1Yy9kL1dQa3EzdWh4Nzk1ZnZTYWY&traceId=1',
  })
  productImg: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Category, { each: true })
  @ApiProperty({
    description: 'Product categories',
    type: 'array',
    items: {
      type: 'string',
      enum: Object.values(Category), // ✨ 여기 수정
    },
    example: ['SMARTPHONE', 'ELECTRONICS'],
  })
  categories: Category[];
}
