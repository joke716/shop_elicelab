import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { Provider } from '../common/enums/provider.enum';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { TokenPayloadInterface } from './interfaces/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async registerUser(createUserDto: CreateUserDto): Promise<User> {
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

  public async getAuthenticatedUser(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;
    const member = await this.userService.getUserBy('email', email);
    const isPasswordMatched = await member.checkPassword(password);
    if (!isPasswordMatched) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    return member;
  }

  public generateAccessToken(userId: string): {
    accessToken: string;
    accessCookie: string;
  } {
    const payload: TokenPayloadInterface = { userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')}`,
    });
    // const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
    //   'REFRESH_TOKEN_EXPIRATION_TIME',
    // )}`;
    const accessCookie = `Authentication=${accessToken}; Path=/; Max-Age=${this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')}`;
    return {
      accessToken,
      accessCookie,
    };
  }

  public generateRefreshToken(userId: string): {
    refreshCookie: string;
    refreshToken: string;
  } {
    const payload: TokenPayloadInterface = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME')}`,
    });
    const refreshCookie = `Refresh=${refreshToken}; Path=/; Max-Age=${this.configService.get(
      'REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
    return {
      refreshToken,
      refreshCookie,
    };
  }
}
