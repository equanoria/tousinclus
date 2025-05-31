import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { WebsocketExceptionFilter } from './utils/filters/websocket-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add a global prefix to all routes
  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  // TODO Tester si retirer cette ligne à une incidence
  app.useGlobalFilters(new WebsocketExceptionFilter());

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
