import { Module } from '@nestjs/common';
import { EmployeesService } from './service/employees.service';
import { EmpleadosRepository } from './repository/empleados.repository';
import { EmployeesController } from './controller/employees.controller';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, EmpleadosRepository],
  exports: [EmployeesService],
})
export class EmployeesModule {}
