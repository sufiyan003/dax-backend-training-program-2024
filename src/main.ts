import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Apply Global Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties not present in DTOs
      transform: true, // Automatically transform payloads to DTO classes
      forbidNonWhitelisted: true, // Throws an error if unknown fields are sent
      transformOptions: { enableImplicitConversion: true }, // Converts types automatically
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('DAX-BAZAR API')
    .setDescription('API documentation for DAX-BAZAR')
    .setVersion('1.0')
    .addTag('Categories') // Categories & Subcategories
    .addTag('Products') // Products
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start Server
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Server is running on: http://localhost:${PORT}/api`);
}

bootstrap();
