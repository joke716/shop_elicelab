import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Provider } from '../../common/enums/provider.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'teddy' })
  userName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'teddy' })
  nickName: string;

  @IsEmail()
  @ApiProperty({ example: 'elicelab@elicelab.com' })
  email: string;

  @IsString()
  provider?: Provider;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: [
      'https://example.com/profile1.jpg',
      'https://example.com/profile2.jpg',
    ],
    description: 'An array of profile image URLs',
  })
  profileImg?: string[];

  @IsString()
  @MinLength(7)
  //최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자 :
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)
  @ApiProperty({
    description:
      'Has to match a regular expression: /^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$/',
    example: 'Password123!',
  })
  password?: string;
}
