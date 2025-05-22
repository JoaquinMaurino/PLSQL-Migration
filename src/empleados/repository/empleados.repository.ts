// employee.repository.ts

import { Inject, Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { CreateEmployeeDto } from '../dto/empleado.dto';
import { UpdateEmployeeDto } from '../dto/actualizar-empleado';
import { Employee } from '../entities/empleados.entity';

@Injectable()
export class EmpleadosRepository {
  constructor(
    @Inject('ORACLE_CONNECTION')
    private readonly connection: oracledb.Connection,
  ) {}

  async findAll(): Promise<Employee[]> {
    const result = await this.connection.execute<Employee>(
      `SELECT * FROM HR.EMPLOYEES`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        resultSet: true,
      },
    );

    const resultSet = result.resultSet;
    if (!resultSet) throw new Error('No se obtuvo resultSet.');

    const employees: Employee[] = [];
    let row: Employee;
    while ((row = await resultSet.getRow())) {
      employees.push(row);
    }

    await resultSet.close();
    return employees;
  }

  async findById(id: number): Promise<Employee | null> {
    const result = await this.connection.execute(
      `
      SELECT * FROM HR.EMPLOYEES
      WHERE EMPLOYEE_ID = :id
      `,
      { id },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    const row = result.rows?.[0];
    return row ? (row as Employee) : null;
  }

  async insertEmployee(id: number, data: CreateEmployeeDto): Promise<void> {
    await this.connection.execute(
      `
    INSERT INTO HR.EMPLOYEES (
      EMPLOYEE_ID,
      FIRST_NAME,
      LAST_NAME,
      EMAIL,
      PHONE_NUMBER,
      HIRE_DATE,
      JOB_ID,
      SALARY,
      COMMISSION_PCT,
      MANAGER_ID,
      DEPARTMENT_ID
    ) VALUES (
      :EMPLOYEE_ID,
      :FIRST_NAME,
      :LAST_NAME,
      :EMAIL,
      :PHONE_NUMBER,
      :HIRE_DATE,
      :JOB_ID,
      :SALARY,
      :COMMISSION_PCT,
      :MANAGER_ID,
      :DEPARTMENT_ID
    )
    `,
      {
        EMPLOYEE_ID: id,
        FIRST_NAME: data.FIRST_NAME,
        LAST_NAME: data.LAST_NAME,
        EMAIL: data.EMAIL,
        PHONE_NUMBER: data.PHONE_NUMBER || null,
        HIRE_DATE: new Date(data.HIRE_DATE),
        JOB_ID: data.JOB_ID,
        SALARY: data.SALARY ?? null,
        COMMISSION_PCT: data.COMMISSION_PCT ?? null,
        MANAGER_ID: data.MANAGER_ID ?? null,
        DEPARTMENT_ID: data.DEPARTMENT_ID ?? null,
      },
      { autoCommit: true },
    );
  }

  async deleteEmployeeById(id: number): Promise<number> {
    const result = await this.connection.execute(
      `DELETE FROM HR.EMPLOYEES WHERE EMPLOYEE_ID = :id`,
      { id },
      { autoCommit: false },
    );
    return result.rowsAffected ?? 0;
  }

  async deleteJobHistoryByEmployeeId(id: number): Promise<void> {
    await this.connection.execute(
      `DELETE FROM HR.JOB_HISTORY WHERE EMPLOYEE_ID = :id`,
      { id },
      { autoCommit: false },
    );
  }

  async deleteEmployeeByEmail(email: string): Promise<number> {
    const result = await this.connection.execute(
      `
    DELETE FROM HR.EMPLOYEES
    WHERE UPPER(email) = UPPER(:email)
    `,
      { email },
      { autoCommit: false },
    );
    return result.rowsAffected ?? 0;
  }

  async updateEmployee(id: number, data: UpdateEmployeeDto): Promise<void> {
    await this.connection.execute(
      `UPDATE employees
       SET first_name     = COALESCE(:firstName, first_name),
           last_name      = COALESCE(:lastName, last_name),
           email          = COALESCE(:email, email),
           phone_number   = COALESCE(:phone, phone_number),
           hire_date      = COALESCE(:hireDate, hire_date),
           job_id         = COALESCE(:jobId, job_id),
           salary         = COALESCE(:salary, salary),
           commission_pct = COALESCE(:commissionPct, commission_pct),
           manager_id     = COALESCE(:managerId, manager_id),
           department_id  = COALESCE(:deptId, department_id)
     WHERE employee_id = :employeeId`,
      {
        firstName: { val: data.FIRST_NAME ?? null, type: oracledb.STRING },
        lastName: { val: data.LAST_NAME ?? null, type: oracledb.STRING },
        email: { val: data.EMAIL ?? null, type: oracledb.STRING },
        phone: { val: data.PHONE_NUMBER ?? null, type: oracledb.STRING },
        hireDate: {
          val: data.HIRE_DATE ? new Date(data.HIRE_DATE) : null,
          type: oracledb.DATE,
        },
        jobId: { val: data.JOB_ID ?? null, type: oracledb.STRING },
        salary: { val: data.SALARY ?? null, type: oracledb.NUMBER },
        commissionPct: {
          val: data.COMMISSION_PCT ?? null,
          type: oracledb.NUMBER,
        },
        managerId: { val: data.MANAGER_ID ?? null, type: oracledb.NUMBER },
        deptId: { val: data.DEPARTMENT_ID ?? null, type: oracledb.NUMBER },
        employeeId: { val: Number(id), type: oracledb.NUMBER },
      },
      { autoCommit: false },
    );
  }

  async findJobAndDepartmentById(
    id: number,
  ): Promise<{ JOB_ID: string; DEPARTMENT_ID: number } | null> {
    const result = await this.connection.execute(
      `SELECT job_id, department_id FROM employees WHERE employee_id = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    return (
      (result.rows?.[0] as { JOB_ID: string; DEPARTMENT_ID: number }) ?? null
    );
  }

  async updateJobHistoryIfNeeded(
    id: number,
    newJobId?: string | null,
    newDeptId?: number | null,
  ): Promise<void> {
    if (!newJobId && !newDeptId) return;

    await this.connection.execute(
      `UPDATE job_history
       SET job_id = COALESCE(:jobId, job_id),
           department_id = COALESCE(:deptId, department_id)
     WHERE employee_id = :id
       AND (end_date IS NULL OR end_date = (
         SELECT MAX(end_date) FROM job_history WHERE employee_id = :id
       ))`,
      { jobId: newJobId ?? null, deptId: newDeptId ?? null, id },
      { autoCommit: false },
    );
  }

  async getNextEmployeeId(): Promise<number> {
    const result = await this.connection.execute<{ NEXTVAL: number }>(
      `SELECT HR.EMPLOYEES_SEQ.NEXTVAL AS NEXTVAL FROM DUAL`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const nextId = result.rows?.[0]?.NEXTVAL;
    if (!nextId) throw new Error('No se pudo obtener el ID del nuevo empleado');
    return nextId;
  }

  async logError(
    errorCode: number,
    errorMessage: string,
    nota: string,
  ): Promise<void> {
    await this.connection.execute(
      `
      INSERT INTO log_errors (table_name, log_date, error_code, error_message, nota)
      VALUES ('hr.employees', SYSDATE, :error_code, :error_message, :nota)
      `,
      {
        error_code: errorCode,
        error_message: errorMessage,
        nota,
      },
      { autoCommit: true },
    );
  }

  async commit(): Promise<void> {
    await this.connection.commit();
  }

  async rollback(): Promise<void> {
    await this.connection.rollback();
  }

  getRawConnection() {
    return this.connection;
  }
}
