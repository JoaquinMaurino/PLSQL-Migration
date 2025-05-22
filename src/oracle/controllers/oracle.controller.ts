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
import { OracleService } from '../services/oracle.service';
import { CreateEmployeeDto } from '../dtos/alta-employee.dto';
import { UpdateEmployeeDto } from '../dtos/actualizar-employee.dto';

@Controller('oracle')
export class OracleController {
  constructor(private readonly oracleService: OracleService) {}

  @Get('employees')
  async getEmpleados() {
    return await this.oracleService.getEmpleados();
  }

  @Get('employees/:id')
  async getEmpleadoId(@Param('id', ParseIntPipe) id: number) {
    return await this.oracleService.getEmpleadoId(id);
  }

  @Post('alta-employee')
  async altaEmployee(@Body() data: CreateEmployeeDto) {
    return await this.oracleService.altaEmpleado(data);
  }

  @Delete('baja-employee-id/:id')
  async bajaEmployeeId(@Param('id', ParseIntPipe) id: number) {
    return await this.oracleService.bajaEmpleadoPorId(id);
  }

  @Delete('baja-employee-email')
  async bajaEmployeeEmail(@Query('email') email: string) {
    return await this.oracleService.bajaEmpleadoPorEmail(email);
  }

  @Put('actualizar-employee/:id')
  async actualizarEmpleado(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateEmployeeDto){
    return await this.oracleService.actualizarEmpleado(id, data)
  }
}
