import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ajouter un préfixe global à toutes les routes
  app.setGlobalPrefix('api');

  const port = parseInt(process.env.PORT, 10) || 3001;
  await app.listen(port);
}
bootstrap();
