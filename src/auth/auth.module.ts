import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './strategies /local-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies /access-token.strategy';
import { EmailModule } from '../email/email.module';
import { RefreshTokenStrategy } from './strategies /refresh_token.strategy';

@Module({
  imports: [ConfigModule, JwtModule.register({}), UserModule, EmailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
