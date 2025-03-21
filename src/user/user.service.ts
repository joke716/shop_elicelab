import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private memberRepository: Repository<User>,
  ) {}

  async getUserBy(key: 'id' | 'email', value: string): Promise<User> {
    const member = await this.memberRepository.findOneBy({ [key]: value });
    if (member) return member;
    throw new HttpException(
      `User with this ${key} does not exist`,
      HttpStatus.NOT_FOUND,
    );
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const newUser = await this.memberRepository.create(userData);
    await this.memberRepository.save(newUser);
    return newUser;
  }

}
