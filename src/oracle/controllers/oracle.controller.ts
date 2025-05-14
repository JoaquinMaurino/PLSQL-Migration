import { Controller, Get } from '@nestjs/common';
import { OracleService } from '../services/oracle.service';

@Controller('oracle')
export class OracleController {
    constructor(private readonly oracleService: OracleService) { }

    @Get('stored-procedure')
    async procedure() {
        const result = await this.oracleService.ejecutarStoredProcedure();
        return { result }
    }
}
