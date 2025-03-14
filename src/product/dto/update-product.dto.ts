import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ example: 'iPhone 16 Ultra', required: false })
  name?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  description?: string;

  @ApiProperty({ example: 1700000, required: false })
  price?: number;

  @ApiProperty({
    example: 'https://example.com/new-product-image.jpg',
    required: false,
  })
  productImg?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['Tablets', 'Tech'],
    required: false,
  })
  categories?: string[];
}
