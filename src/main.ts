import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './config/swagger.document';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  // CORS 설정 (필요 시 추가)
  app.enableCors({
    origin: [],
    credentials: false,
  });

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
