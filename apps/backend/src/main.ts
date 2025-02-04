import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add a global prefix to all routes
  app.setGlobalPrefix('api');

  const port = Number.parseInt(process.env.PORT, 10) || 3001;
  await app.listen(port);
}
bootstrap();
