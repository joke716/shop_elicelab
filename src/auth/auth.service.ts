import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { Provider } from '../common/enums/provider.enum';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { TokenPayloadInterface } from './interfaces/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import EmailService from '../email/email.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { EmailVerificationDto } from '../user/dto/email-verification.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  // public generateAccessToken(userId: string): {
  //   accessToken: string;
  //   accessCookie: string;
  // } {
  //   const payload: TokenPayloadInterface = { userId };
  //   const accessToken = this.jwtService.sign(payload, {
  //     secret: this.configService.get('ACCESS_TOKEN_SECRET'),
  //     expiresIn: `${this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')}`,
  //   });
  //   // const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
  //   //   'REFRESH_TOKEN_EXPIRATION_TIME',
  //   // )}`;
  //   const accessCookie = `Authentication=${accessToken}; Path=/; Max-Age=${this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')}`;
  //   return {
  //     accessToken,
  //     accessCookie,
  //   };
  // }
  //
  // public generateRefreshToken(userId: string): {
  //   refreshCookie: string;
  //   refreshToken: string;
  // } {
  //   const payload: TokenPayloadInterface = { userId };
  //   const refreshToken = this.jwtService.sign(payload, {
  //     secret: this.configService.get('REFRESH_TOKEN_SECRET'),
  //     expiresIn: `${this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME')}`,
  //   });
  //   const refreshCookie = `Refresh=${refreshToken}; Path=/; Max-Age=${this.configService.get(
  //     'REFRESH_TOKEN_EXPIRATION_TIME',
  //   )}`;
  //   return {
  //     refreshToken,
  //     refreshCookie,
  //   };
  // }

  public generateToken(
    userId: string,
    tokenType: 'access' | 'refresh',
  ): {
    token: string;
    cookie: string;
  } {
    const payload: TokenPayloadInterface = { userId };

    const secretKey = this.configService.get(
      tokenType === 'access' ? 'ACCESS_TOKEN_SECRET' : 'REFRESH_TOKEN_SECRET',
    );
    const expirationTime = this.configService.get(
      tokenType === 'access'
        ? 'ACCESS_TOKEN_EXPIRATION_TIME'
        : 'REFRESH_TOKEN_EXPIRATION_TIME',
    );

    const token = this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: `${expirationTime}`,
    });

    const cookieName = tokenType === 'access' ? 'Authentication' : 'Refresh';
    const cookie = `${cookieName}=${token}; Path=/; Max-Age=${expirationTime}`;

    return {
      token,
      cookie,
    };
  }

  public getCookiesForLogOut(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async initiateEmailAddressVerification(email: string): Promise<void> {
    const generateNumber = this.generateOTP();
    await this.cacheManager.set(email, generateNumber);
    return await this.emailService.sendMail({
      to: email,
      subject: 'BeeCouple - Verification Email Address',
      html: `<h1>${generateNumber}</h1>`,
    });
  }

  generateOTP() {
    let OTP = '';
    for (let i = 1; i <= 6; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }

  async confirmEmailVerification(
    emailVerificationDto: EmailVerificationDto,
  ): Promise<boolean> {
    const { email, code } = emailVerificationDto;
    const emailCodeByRedis = await this.cacheManager.get(email);
    if (emailCodeByRedis !== code) {
      throw new BadRequestException('Wrong code provided');
    }
    await this.cacheManager.del(email);
    return true;
  }
}
