import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

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
  @Post('/login')
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'login success' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'forbidden' })
  @ApiOperation({
    summary: 'Member Login',
    description: 'Member Login',
  })
  async logIn(@Body() loginUserDto: LoginUserDto): Promise<User> {
    return await this.authService.getAuthenticatedUser(loginUserDto);
  }
}
