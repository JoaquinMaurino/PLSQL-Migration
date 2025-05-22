import { Module } from '@nestjs/common';
import { EmpleadosService } from './service/empleados.service';
import { EmpleadosRepository } from './repository/empleados.repository';
import { EmpleadosController } from './controller/empleados.controller';

@Module({
  controllers: [EmpleadosController],
  providers: [EmpleadosService, EmpleadosRepository],
  exports: [EmpleadosService],
})
export class EmpleadosModule {}
