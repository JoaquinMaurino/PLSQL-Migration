import { Module } from '@nestjs/common';
import { DepartmentsService } from './service/departments.service';
import { DepartmentsController } from './controller/departments.controller';

@Module({
  providers: [DepartmentsService],
  controllers: [DepartmentsController]
})
export class DepartmentsModule {}
