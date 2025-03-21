import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailVerificationDto {
  @IsEmail()
  @ApiProperty({ example: 'elicelab@elicelab.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: '000000' })
  code: string;
}
