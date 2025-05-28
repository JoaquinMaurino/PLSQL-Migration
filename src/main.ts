import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no estan en el DTO
      forbidNonWhitelisted: true, // Lanza error si llegan prpiedades no permitidas
      transform: true, // convierte payloads a instancias de clase automaticamente
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
