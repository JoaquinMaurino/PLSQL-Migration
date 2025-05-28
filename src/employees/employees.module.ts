import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeesService } from './service/employees.service';
import { EmployeesRepository } from './repository/employees.repository';
import { EmployeesController } from './controller/employees.controller';
import { Employee } from './entities/employees.entity';

import { JobHistory } from '../job-history/entities/job-history.entity';
import { JobHistoryModule } from 'src/job-history/job-history.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), JobHistoryModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository],
})
export class EmployeesModule {}
