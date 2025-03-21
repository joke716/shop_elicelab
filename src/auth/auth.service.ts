import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { Provider } from '../common/enums/provider.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  public async registerMember(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.createUser({
        ...createUserDto,
        provider: Provider.LOCAL,
      });
    } catch (err) {
      if (err?.code !== PostgresErrorCode.unique_violation) {
        if (err?.code === PostgresErrorCode.not_null_violation) {
          throw new HttpException(
            'Please check not null body value',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
