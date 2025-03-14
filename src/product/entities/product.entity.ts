import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
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

  // ✅ 단순 문자열 배열로 저장 (CSV 형식)
  @Column('simple-array')
  public categories: string[];

  @OneToMany(() => Comment, (comment) => comment.product, {
    eager: true,
    cascade: true,
  })
  public comments: Comment[];
}
