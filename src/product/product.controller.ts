import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Product Creat
  @Post('/new')
  @ApiOperation({
    summary: '상품 생성',
    description: '새로운 상품을 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '상품이 성공적으로 생성되었습니다.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return await this.productService.createProduct(createProductDto);
  }

  // Get All Products
  @Get('/all')
  async getProducts(): Promise<Product[]> {
    return await this.productService.getAllProducts();
  }

  // Get product by id
  @Get('/:id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return await this.productService.getProductById(id);
  }

  // delete product by id
  @Delete('/:id')
  async deleteProductById(@Param('id') id: string): Promise<string> {
    return await this.productService.deleteProductById(id);
  }

  // delete product by id
  @Delete()
  async deleteAllProducts(): Promise<string> {
    return await this.productService.deleteAllProducts();
  }

  // update product by id
  @Put('/:id')
  @ApiOperation({
    summary: '상품 수정',
    description: '상품 정보를 업데이트합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '상품이 성공적으로 수정되었습니다.',
  })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없습니다.' })
  @ApiBody({
    description: '수정할 상품 정보를 입력하세요.',
    type: UpdateProductDto,
  })
  async updateProductById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<string> {
    return await this.productService.updateProductById(id, updateProductDto);
  }
}
