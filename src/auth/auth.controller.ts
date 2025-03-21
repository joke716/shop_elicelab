import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { RequestWithUser } from './interfaces/RequestWithUser';
import { AccessTokenGuard } from './guards/accessToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'User Signup', description: 'User Signup' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Signup success',
    type: User,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async registerMember(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto);
    return await this.authService.registerUser(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'login success' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'forbidden' })
  @ApiOperation({
    summary: 'User Login',
    description: 'User Login',
  })
  async logIn(
    @Req() req: RequestWithUser,
    // @Res() response: Response,
  ): Promise<void> {
    const { user } = req;
    const { accessToken: accessToken, accessCookie: accessTokenCookie } =
      await this.authService.generateAccessToken(user.id);

    const { refreshToken: refreshToken, refreshCookie: refreshTokenCookie } =
      await this.authService.generateRefreshToken(user.id);

    user.password = undefined;
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    req.res.send({ user, accessToken, refreshToken });
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiOperation({ summary: 'Get User Info', description: 'Get User Info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User Info success',
    type: User,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'forbidden' })
  async authenticate(@Req() req: RequestWithUser): Promise<User> {
    return await req.user;
  }
}
