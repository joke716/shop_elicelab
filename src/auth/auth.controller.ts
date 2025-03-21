import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

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
  async registerMember(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    console.log(createUserDto);
    return await this.authService.registerMember(createUserDto);
  };

}
