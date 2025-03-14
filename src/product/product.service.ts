import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // creat product
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const newProdcut = await this.productRepository.create(createProductDto);
    await this.productRepository.save(newProdcut);
    return newProdcut;
  }

  // get all products
  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  // get product by id
  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return product;
  }

  // delete product by id
  async deleteProductById(id: string): Promise<string> {
    const deleteResponse = await this.productRepository.delete(id);
    if (!deleteResponse.affected)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return 'deleted';
  }

  async deleteAllProducts(): Promise<string> {
    const deleteResponse = await this.productRepository
      .createQueryBuilder()
      .delete()
      .from(Product) // Product는 엔티티 이름
      .execute();

    if (!deleteResponse.affected) {
      throw new HttpException(
        'No products found to delete',
        HttpStatus.NOT_FOUND,
      );
    }

    return 'All products deleted successfully';
  }

  // update product by id
  async updateProductById(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<string> {
    const existingProduct = await this.productRepository.findOneBy({ id });

    if (!existingProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // Merge existing data with new data
    const updatedProduct = {
      ...existingProduct,
      ...updateProductDto,
    };

    await this.productRepository.save(updatedProduct);

    return 'updated';
  }
}
