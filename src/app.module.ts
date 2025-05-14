import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OracleService } from './oracle/oracle.service';
import { OracleController } from './oracle/controllers/oracle.controller';

@Module({
  imports: [],
  controllers: [AppController, OracleController],
  providers: [AppService, OracleService],
})
export class AppModule {}
