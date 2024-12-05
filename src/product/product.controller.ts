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

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Product Creat
  @Post('/new')
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
  async updateProductById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<string> {
    return await this.productService.updateProductById(id, updateProductDto);
  }
}
