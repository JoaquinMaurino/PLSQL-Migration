import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrcaleProceduresService } from '../services/orcale_procedures.service';
import { CreateEmployeeDto } from '../dtos/alta-employee.dto';

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
  async altaEmployee(@Body() data: CreateEmployeeDto){
    return await this.oracleProceduresService.altaEmpleado(data)
  }
}
