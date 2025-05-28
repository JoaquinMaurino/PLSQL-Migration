import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employees.entity';
import { Job } from '../../jobs/entities/jobs.entity';
import { Department } from '../../departments/entities/departments.entity';

@Entity({ name: 'JOB_HISTORY', schema: 'HR' })
export class JobHistory {
  @PrimaryColumn({
    name: 'EMPLOYEE_ID',
    type: 'number',
    precision: 6,
    scale: 0,
  })
  EMPLOYEE_ID: number;

  @PrimaryColumn({ name: 'START_DATE', type: 'date' })
  START_DATE: Date;

  @Column({ name: 'END_DATE', type: 'date', nullable: false })
  END_DATE: Date;

  @Column({ name: 'JOB_ID', type: 'varchar2', length: 10, nullable: false })
  JOB_ID: string;

  @Column({
    name: 'DEPARTMENT_ID',
    type: 'number',
    precision: 4,
    scale: 0,
    nullable: true,
  })
  DEPARTMENT_ID: number | null;

  // Relaciones

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'EMPLOYEE_ID' })
  employee: Employee;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'JOB_ID' })
  job: Job;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'DEPARTMENT_ID' })
  department: Department | null;
}
