import { Controller, Get } from '@nestjs/common';
import { OrcaleProceduresService } from '../services/orcale_procedures.service';

@Controller('oracle')
export class OracleController {
  constructor(
    private readonly oracleProceduresService: OrcaleProceduresService,
  ) {}

  @Get('employees')
  async getEmployees() {
    return await this.oracleProceduresService.getEmployees();
  }
}
