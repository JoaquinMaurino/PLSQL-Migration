import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  Put,
} from '@nestjs/common';
import { EmployeesService } from '../service/employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto/employees.dto';

@Controller('empleados')
export class EmployeesController {
  constructor(private readonly empleadosService: EmployeesService) {}

  @Get()
  async getEmpleados() {
    return await this.empleadosService.getEmpleados();
  }

  @Get(':id')
  async getEmpleadoId(@Param('id', ParseIntPipe) id: number) {
    return await this.empleadosService.getEmpleadoId(id);
  }

  @Post('')
  async altaEmployee(@Body() data: CreateEmployeeDto) {
    return await this.empleadosService.altaEmpleado(data);
  }

  @Delete(':id')
  async bajaEmployeeId(@Param('id', ParseIntPipe) id: number) {
    return await this.empleadosService.bajaEmpleadoPorId(id);
  }

  @Delete()
  async bajaEmployeeEmail(@Query('email') email: string) {
    return await this.empleadosService.bajaEmpleadoPorEmail(email);
  }

  @Put(':id')
  async actualizarEmpleado(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateEmployeeDto){
    return await this.empleadosService.actualizarEmpleado(id, data)
  }
}
