import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('✅ Iniciando la aplicacion...');

  try {
    const app = await NestFactory.create(AppModule);
    logger.log('✅ App creada correctamente');
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Elimina propiedades que no estan en el DTO
        forbidNonWhitelisted: true, // Lanza error si llegan prpiedades no permitidas
        transform: true, // convierte payloads a instancias de clase automaticamente
      }),
    );
    await app.listen(process.env.PORT || 3000);

    logger.log('✅ NestJS backend corriendo en el puerto 3000');
  } catch (error) {
    logger.error('Error al iniciar la app de nestjs: ', error);
  }
}
bootstrap();
