import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Category } from './category.enum';

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

  @Column({
    type: 'enum',
    enum: Category,
    array: true,
  })
  public categories: Category[];

  @OneToMany(() => Comment, (comment) => comment.product, {
    eager: true,
    cascade: true,
  })
  public comments: Comment[];
}
