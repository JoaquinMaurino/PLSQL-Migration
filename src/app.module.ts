import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { OracleModule } from './db/oracle.module';
import { ConfigModule } from '@nestjs/config';
import { EmpleadosModule } from './empleados/empleados.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OracleModule,
    EmpleadosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
