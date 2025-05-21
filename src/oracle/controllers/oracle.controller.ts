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
import { OrcaleProceduresService } from '../services/orcale_procedures.service';
import { CreateEmployeeDto } from '../dtos/alta-employee.dto';
import { UpdateEmployeeDto } from '../dtos/actualizar-employee.dto';

@Controller('oracle')
export class OracleController {
  constructor(
    private readonly oracleProceduresService: OrcaleProceduresService,
  ) {}

  @Get('employees')
  async getEmployees() {
    return await this.oracleProceduresService.getEmployees();
  }

  @Post('alta-employee')
  async altaEmployee(@Body() data: CreateEmployeeDto) {
    return await this.oracleProceduresService.altaEmpleado(data);
  }

  @Delete('baja-employee-id/:id')
  async bajaEmployeeId(@Param('id', ParseIntPipe) id: number) {
    return await this.oracleProceduresService.bajaEmpleadoPorId(id);
  }

  @Delete('baja-employee-email')
  async bajaEmployeeEmail(@Query('email') email: string) {
    return await this.oracleProceduresService.bajaEmpleadoPorEmail(email);
  }

  @Put('actualizar-employee/:id')
  async actualizarEmpleado(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateEmployeeDto){
    return await this.oracleProceduresService.actualizarEmpleado(id, data)
  }
}
