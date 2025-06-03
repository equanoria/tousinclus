import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setup } from './setup';

async function bootstrap() {
  await setup();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors();
  app.setGlobalPrefix('api');

  const port = Number.parseInt(process.env.PORT, 10) || 3201; // TODO: use 3001
  await app.listen(port);
}

bootstrap();
