import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  public content: string;

  @ManyToOne(() => Product, (product: Product) => product.comments, {
    eager: false,
  })
  public product: Product;
}
