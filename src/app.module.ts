import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { OracleModule } from './oracle/oracle.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OracleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
