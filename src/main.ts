import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformer } from './common/transformers/response.transformer';
;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter(new ResponseTransformer()));



  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Microservices API Gateway')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap(); 