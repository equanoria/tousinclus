import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add a global prefix to all routes
  app.setGlobalPrefix('api');
  app.enableCors();

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle("Documentation de l'API")
    .setDescription('Description de votre API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number.parseInt(process.env.PORT, 10) || 3001;
  await app.listen(port);
}
bootstrap();
