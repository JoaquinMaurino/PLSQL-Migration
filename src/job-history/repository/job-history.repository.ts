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

  async deleteJobHistoryByEmployeeId(id: number): Promise<DeleteResult> {
    return await this.jobHisRepo.delete({ employee: { EMPLOYEE_ID: id } });
  }

  async updateJobHistoryIfNeeded(
    id: number,
    newJobId?: string | null,
    newDeptId?: number | null,
  ): Promise<void> {
    if (!newJobId && !newDeptId) return;

    //Buscar la última entrada de job_history del empleado (con orderBy(...).limit(1) en reemplazo de MAX(end_date) )
    const latestHistory = await this.jobHisRepo
      .createQueryBuilder('job_history')
      .where('job_history.EMPLOYEE_ID = :id', { id })
      .orderBy('job_history.END_DATE', 'DESC')
      .limit(1)
      .getOne();

    if (!latestHistory) return;

    //Solo actualizar si hay algo que cambiar
    if (newJobId) latestHistory.JOB_ID = newJobId;
    if (newDeptId !== undefined) latestHistory.DEPARTMENT_ID = newDeptId;

    //Guardar cambios
    await this.jobHisRepo.save(latestHistory);
  }
}
