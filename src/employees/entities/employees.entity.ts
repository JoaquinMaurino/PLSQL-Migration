import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from '../../departments/entities/departments.entity';
import { Job } from '../../jobs/entities/jobs.entity';

@Entity({ name: 'EMPLOYEES', schema: 'HR' })
export class Employee {
  // Primary key: Employee identifier
  @PrimaryColumn({ name: 'EMPLOYEE_ID', type: 'number', precision: 6 })
  EMPLOYEE_ID: number;

  // Employee first name (not nullable)
  @Column({ name: 'FIRST_NAME', type: 'varchar', length: 20 })
  FIRST_NAME: string;

  // Employee last name (not nullable)
  @Column({ name: 'LAST_NAME', type: 'varchar', length: 25 })
  LAST_NAME: string;

  // Employee email (not nullable)
  @Column({ name: 'EMAIL', type: 'varchar', length: 25 })
  EMAIL: string;

  // Optional phone number with country and area code
  @Column({ name: 'PHONE_NUMBER', type: 'varchar', length: 20, nullable: true })
  PHONE_NUMBER?: string | null;

  // Date when employee started the job (not nullable)
  @Column({ name: 'HIRE_DATE', type: 'date' })
  HIRE_DATE: Date;

  // Many employees have one job (Foreign key relation to jobs table)
  @ManyToOne(() => Job)
  @JoinColumn({ name: 'JOB_ID' })
  JOB: Job;

  // Foreign key column storing the job ID
  @Column({ name: 'JOB_ID', type: 'varchar', length: 10 })
  JOB_ID: string;

  // Monthly salary, optional, must be greater than zero if present
  @Column({
    name: 'SALARY',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  SALARY?: number | null;

  // Commission percentage, optional, applicable mostly for sales employees
  @Column({
    name: 'COMMISSION_PCT',
    type: 'decimal',
    precision: 2,
    scale: 2,
    nullable: true,
  })
  COMMISSION_PCT?: number | null;

  // Manager of the employee (self-referential many-to-one relation)
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'MANAGER_ID' })
  MANAGER?: Employee;

  // Foreign key column for manager ID
  @Column({ name: 'MANAGER_ID', type: 'number', precision: 6, nullable: true })
  MANAGER_ID?: number | null;

  // Department where the employee works (many employees to one department)
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'DEPARTMENT_ID' })
  DEPARTMENT?: Department;

  // Foreign key column for department ID
  @Column({
    name: 'DEPARTMENT_ID',
    type: 'number',
    precision: 4,
    nullable: true,
  })
  DEPARTMENT_ID?: number | null;
}
