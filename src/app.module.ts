import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EmployeesModule } from './employees/employees.module';
import { CountriesModule } from './countries/countries.module';
import { DepartmentsModule } from './departments/departments.module';
import { JobHistoryModule } from './job-history/job-history.module';
import { JobsModule } from './jobs/jobs.module';
import { LocationsModule } from './locations/locations.module';
import { RegionsModule } from './regions/regions.module';
import { LogErrorsModule } from './log-errors/log-errors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const libDir = configService.get<string>('ORACLE_LIB_DIR');
        const configDir = configService.get<string>('ORACLE_CONFIG_DIR');

        // Inicializamos Oracle Client
        oracledb.initOracleClient({
          libDir,
          configDir,
        });
        console.log('Initializing Oracle Client...');

        return {
          type: 'oracle',
          username: configService.get('ORACLE_USER'),
          password: configService.get('ORACLE_PASSWORD'),
          connectString: configService.get('ORACLE_CONNECT_STRING'),
          entities: [join(__dirname, '/../**/*.entity.js')],
          synchronize: false,
        };
      },
    }),
    EmployeesModule,
    CountriesModule,
    DepartmentsModule,
    JobHistoryModule,
    JobsModule,
    LocationsModule,
    RegionsModule,
    LogErrorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
