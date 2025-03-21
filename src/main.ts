import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './config/swagger.document';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  // CORS 설정 (필요 시 추가)
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // Global interceptor
  app.useGlobalInterceptors(new TransformInterceptor());
  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);

  await app.listen(configService.get<number>('BACKEND_PORT'));
}
bootstrap();
