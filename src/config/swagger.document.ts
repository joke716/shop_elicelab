import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Elicelab OPEN API')
    .setDescription('Elicelab OPEN API')
    .addCookieAuth('Authentication')
    .setVersion('1.0')
    .addTag('elice', 'elicelab')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document);
};
