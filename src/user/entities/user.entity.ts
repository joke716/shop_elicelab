import { BeforeInsert, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Exclude } from 'class-transformer';
import { Provider } from '../../common/enums/provider.enum';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';

@Entity()
export class User extends BaseEntity {
  @Column()
  public userName: string;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  @Exclude()
  public password?: string;

  @Column({ type: 'text', array: true, nullable: true })
  public profileImg?: string[];

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  public provider: Provider;

  @BeforeInsert()
  async beforeSaveFunction(): Promise<void> {
    try {
      if (this.provider !== Provider.LOCAL) {
        return;
      } else {
        // Set profileImg as an array with the generated Gravatar URL
        this.profileImg = [
          gravatar.url(this.email, {
            s: '200',
            r: 'pg',
            d: 'mm',
            protocol: 'https',
          }),
        ];

        // Encrypt password if it exists
        if (this.password) {
          const saltValue = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, saltValue);
        }
      }
    } catch (error) {
      console.error('Error in beforeSaveFunction:', error);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
