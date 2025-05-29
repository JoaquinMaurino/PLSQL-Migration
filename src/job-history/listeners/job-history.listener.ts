import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JobHistoryRepository } from '../repository/job-history.repository';

//Listener que simula el trigger de la tabla Employees de la DB 
//Escucha el evento que actualiza los campos JOB_ID y/o DEPARTMENT_ID desde EmployeesRepository
//Si esos campos se modifican en EMPLOYEES, tambien se actualizan en JOB_HISTORY
@Injectable()
export class JobHistoryListener {
  constructor(private readonly jobHistRepo: JobHistoryRepository) {}

  @OnEvent('employeeUpdated')
  async handleEmployeeUpdatedEvent(payload: {
    id: number;
    newJobId?: string;
    newDeptId?: number | null;
    hireDate: Date;
  }) {
    console.log(`Listener triggered with payload:`, JSON.stringify(payload, null, 2));
    
    const { id, newJobId, newDeptId, hireDate } = payload;

    // Validar que hireDate sea una fecha válida
    const hireDateParsed = new Date(hireDate);
    if (!(hireDateParsed instanceof Date) || isNaN(hireDateParsed.getTime())) {
      console.error(`Invalid hireDate received:`, hireDate);
      return; // evitar ejecutar con fecha inválida
    }

    await this.jobHistRepo.updateJobHistoryIfNeeded(
      id,
      newJobId,
      newDeptId,
      hireDateParsed, // ← fecha validada
    );

    console.log(`updateJobHistoryIfNeeded ejecutado para empleado ${id}`);
  }
}
