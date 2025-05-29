import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { JobHistory } from '../entities/job-history.entity';

@Injectable()
export class JobHistoryRepository {
  constructor(
    @InjectRepository(JobHistory)
    private readonly jobHisRepo: Repository<JobHistory>,
  ) {}

  async createJobHistory(data: Partial<JobHistory>) {
    const jobHist = this.jobHisRepo.create(data);
    return this.jobHisRepo.save(jobHist);
  }

  async deleteJobHistoryByEmployeeId(id: number): Promise<DeleteResult> {
    return await this.jobHisRepo.delete({ employee: { EMPLOYEE_ID: id } });
  }

  // Metodo que actualiza un campo de la tabla si se modifica JOB_ID o DEPARTMENT_ID desde la entidad Employees
  async updateJobHistoryIfNeeded(
    id: number,
    newJobId?: string | null,
    newDeptId?: number | null,
    hireDate?: Date,
  ): Promise<void> {
    if (!newJobId && !newDeptId) return;

    // Normalizar fecha a medianoche local (fecha sin hora)
    const normalizedDate = new Date(
      hireDate!.getFullYear(),
      hireDate!.getMonth(),
      hireDate!.getDate(),
    );

    // Buscar si ya existe un registro con EMPLOYEE_ID + START_DATE
    const existing = await this.jobHisRepo.findOne({
      where: {
        EMPLOYEE_ID: id,
        START_DATE: normalizedDate,
      },
    });

    if (!existing) {
      console.log('No job history found, nothing to update.');
      return;
    }

    const updateFields: Partial<JobHistory> = {};
    if (newJobId && newJobId !== existing.JOB_ID)
      updateFields.JOB_ID = newJobId;
    if (newDeptId !== null && newDeptId !== existing.DEPARTMENT_ID)
      updateFields.DEPARTMENT_ID = newDeptId;

    if (Object.keys(updateFields).length === 0) {
      console.log('No changes in job or department to update.');
      return;
    }

    // 🔁 Ejecutar update
    console.log('Intentando actualizar job_history con:', {
      EMPLOYEE_ID: id,
      START_DATE: normalizedDate,
      updateFields,
    });

    const result = await this.jobHisRepo.update(
      {
        EMPLOYEE_ID: id,
        START_DATE: normalizedDate,
      },
      updateFields,
    );

    console.log('Resultado del update:', result);
  }

  async existsByEmployeeAndStartDate(
    employeeId: number,
    startDate: Date,
  ): Promise<boolean> {
    const record = await this.jobHisRepo.findOne({
      where: {
        EMPLOYEE_ID: employeeId,
        START_DATE: startDate,
      },
    });

    return !!record;
  }
}
