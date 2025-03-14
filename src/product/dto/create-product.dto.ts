import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsNotEmpty()
  @ApiProperty({
    type: 'array',
    items: { type: 'string' }, // Swagger에서 올바르게 인식되도록 수정
    example: ['Electronics', 'Smartphones', 'Apple'],
  })
  categories: string[];
}
