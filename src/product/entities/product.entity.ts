import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Category } from '../../category/entities/category.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity()
export class Product extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  productImg: string;

  // @ManyToOne(() => Category, (category: Category) => category.products)
  // public category: Category;

  @ManyToMany(() => Category, (category: Category) => category.products)
  public categories: Category[];

  @OneToMany(() => Comment, (comment: Comment) => comment.product)
  public comments: Comment[];
}
