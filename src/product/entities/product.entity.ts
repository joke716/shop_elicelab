import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  productImg: string;
}
