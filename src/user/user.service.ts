import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private memberRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ): Promise<User> {
    const user = await this.getUserBy('id', userId);
    const getUserIdFromRedis = await this.cacheManager.get(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      getUserIdFromRedis,
    );
    if (isRefreshTokenMatching) return user;
  }

  async setCurrentRefreshTokenToRedis(
    refreshToken: string,
    userId: string,
  ): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.cacheManager.set(userId, currentHashedRefreshToken);
  }

  async removeRefreshTokenFromRedis(userId: string): Promise<void> {
    await this.cacheManager.del(userId);
  }
}
