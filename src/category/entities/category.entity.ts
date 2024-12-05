import { Column, Entity, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Category extends BaseEntity {
  @Column()
  public name: string;

  @OneToMany(() => Product, (product) => product.categories)
  public products: Product[];
}
