import { Injectable, Inject } from '@nestjs/common';
import * as oracledb from 'oracledb';

import { CreateEmployeeDto } from '../dtos/alta-employee.dto';
import { UpdateEmployeeDto } from '../dtos/actualizar-employee.dto';

export interface Employee {
  EMPLOYEE_ID: number;
  FIRST_NAME: string;
  LAST_NAME: string;
  EMAIL: string;
  PHONE_NUMBER: string;
  HIRE_DATE: Date;
  JOB_ID: string;
  SALARY: number;
  COMMISSION_PCT: number;
  MANAGER_ID: number;
  DEPARTMENT_ID: number;
}

@Injectable()
export class OracleService {
  constructor(
    @Inject('ORACLE_CONNECTION')
    private readonly connection: oracledb.Connection,
  ) {}

  async getEmpleados(): Promise<Employee[]> {
    try {
      const result = await this.connection.execute<Employee>(
        `SELECT * FROM HR.EMPLOYEES`,
        [],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
          resultSet: true, // Simula el uso de cursor
        },
      );

      const resultSet = result.resultSet;
      if (!resultSet) throw new Error('No se obtuvo resultSet.');

      const rows: Employee[] = [];
      let row: Employee;
      while ((row = await resultSet.getRow())) {
        rows.push(row);
      }

      await resultSet.close();
      return rows;
    } catch (error) {
      console.error('Error obteniendo empleados:', error);
      throw error;
    }
  }

  async getEmpleadoId(id: number): Promise<Employee | string> {
    try {
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

      if (!row) {
        return `Empleado con ID ${id} no encontrado`;
      }

      return row as Employee;
    } catch (error) {
      const errorMessage = error.message || 'Error desconocido';
      const errorCode = error.errorNum || 0;

      // Intentamos registrar el error como hace el procedimiento
      try {
        await this.connection.execute(
          `
         INSERT INTO log_errors (table_name, log_date, error_code, error_message, nota)
         VALUES ('hr.employees', SYSDATE, :error_code, :error_message, :nota)
         `,
          {
            error_code: errorCode,
            error_message: errorMessage,
            nota: 'NodeJS.altaEmpleado',
          },
          { autoCommit: true },
        );
      } catch (logError) {
        console.error('No se pudo registrar en log_errors:', logError);
      }
      throw new Error(errorMessage);
    }
  }

  async altaEmpleado(data: CreateEmployeeDto): Promise<string> {
    const requiredFields = [
      data.LAST_NAME,
      data.EMAIL,
      data.HIRE_DATE,
      data.JOB_ID,
    ];

    // Validación de campos obligatorios
    if (requiredFields.some((field) => field === null || field === undefined)) {
      return 'Para el alta de un empleado es obligatoria la carga del apellido, mail, inicio de actividad y job id';
    }
    try {
      // Obtener el siguiente valor de la secuencia
      const result = await this.connection.execute<{ NEXTVAL: number }>(
        `SELECT HR.EMPLOYEES_SEQ.NEXTVAL AS NEXTVAL FROM DUAL`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const employeeId = result.rows?.[0]?.NEXTVAL;
      if (!employeeId) {
        throw new Error('No se pudo obtener el ID del nuevo empleado');
      }

      // Insertar el nuevo empleado
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
          EMPLOYEE_ID: employeeId,
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
        { autoCommit: true }, // hace el COMMIT como en PL/SQL
      );

      return `Se agregó el empleado sin inconvenientes, el mismo quedó con el Id número: ${employeeId}`;
    } catch (error: any) {
      const errorMessage = error.message || 'Error desconocido';
      const errorCode = error.errorNum || 0;

      // Intentamos registrar el error como hace el procedimiento
      try {
        await this.connection.execute(
          `
         INSERT INTO log_errors (table_name, log_date, error_code, error_message, nota)
         VALUES ('hr.employees', SYSDATE, :error_code, :error_message, :nota)
         `,
          {
            error_code: errorCode,
            error_message: errorMessage,
            nota: 'NodeJS.altaEmpleado',
          },
          { autoCommit: true },
        );
      } catch (logError) {
        console.error('No se pudo registrar en log_errors:', logError);
      }

      throw new Error(errorMessage);
    }
  }

  async bajaEmpleadoPorId(id: number): Promise<string> {
    if (!id) {
      return 'Para eliminar un empleado el id del mismo es requerido';
    }
    try {
      //Eliminar primero de HR.JOB_HISTORY
      await this.connection.execute(
        `DELETE FROM HR.JOB_HISTORY
             WHERE EMPLOYEE_ID = :id
            `,
        { id },
        { autoCommit: false }, //Todavia no confirmamos
      );

      //Eliminar de HR.EMPLOYEES
      const result = await this.connection.execute(
        `
        DELETE FROM HR.EMPLOYEES
        WHERE EMPLOYEE_ID = :id
        `,
        {
          id,
        },
        {
          autoCommit: false, //Todavia no confirmamos
        },
      );

      const rowsAffected = result.rowsAffected ?? 0;
      if (rowsAffected === 1) {
        await this.connection.commit(); // Confirmamos los delete en ambas tablas
        return `Se elimino el empleado con id: ${id}`;
      } else {
        await this.connection.rollback(); // No se borro, cancelamos las eliminaciones
        return `No se encontro un empleado con id: ${id}`;
      }
    } catch (error) {
      const errorMessage = error.message || 'Error desconocido';
      const errorCode = error.errorNum || 0;

      // Intentar registrar el error en log_errors
      try {
        await this.connection.execute(
          `
        INSERT INTO LOG_ERRORS (table_name, log_date, error_code, error_message, nota)
        VALUES ('hr.employees', SYSDATE, :error_code, :error_message, :nota)
        `,
          {
            error_code: errorCode,
            error_message: errorMessage,
            nota: 'NodeJS.bajaEmpleadoPorId',
          },
          { autoCommit: true },
        );
      } catch (logError) {
        console.error('No se pudo registrar en LOG_ERRORS:', logError);
      }

      throw new Error('Falló la baja del empleado.');
    }
  }

  async bajaEmpleadoPorEmail(email: string): Promise<string> {
    if (!email) {
      return 'Para el borrado de un empleado es obligatorio el envío del email.';
    }

    try {
      // Eliminar empleado por email, ignorando mayúsculas/minúsculas
      const result = await this.connection.execute(
        `
      DELETE FROM HR.EMPLOYEES
      WHERE UPPER(email) = UPPER(:email)
      `,
        { email },
        { autoCommit: false }, // Aún no confirmamos hasta verificar resultado
      );

      const rowsAffected = result.rowsAffected ?? 0;

      if (rowsAffected === 1) {
        await this.connection.commit();
        return `Se eliminó correctamente el empleado con email: ${email}`;
      } else {
        await this.connection.rollback();
        return `No se encontró ningún empleado con email: ${email}`;
      }
    } catch (error) {
      const errorMessage = error.message || 'Error desconocido';
      const errorCode = error.errorNum || 0;

      // Intentar registrar en log_errors
      try {
        await this.connection.execute(
          `
        INSERT INTO log_errors (table_name, log_date, error_code, error_message, nota)
        VALUES ('hr.employees', SYSDATE, :error_code, :error_message, :nota)
        `,
          {
            error_code: errorCode,
            error_message: errorMessage,
            nota: 'NodeJS.bajaEmpleadoPorEmail',
          },
          { autoCommit: true },
        );
      } catch (logError) {
        console.error('No se pudo registrar en LOG_ERRORS:', logError);
      }

      throw new Error(
        'Error al intentar eliminar el empleado. Ver logs para más información.',
      );
    }
  }

  async actualizarEmpleado(
    id: number,
    data: UpdateEmployeeDto,
  ): Promise<string> {
    if (!id) {
      return 'Para actualizar a un empleado es obligatorio el envío del Código del Empleado.';
    }

    try {
      // 1. Obtener job_id y department_id actuales y verificar existencia del empleado
      const jobDeptResult = await this.connection.execute(
        `SELECT job_id, department_id FROM employees WHERE employee_id = :id`,
        { id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );

      const row = jobDeptResult.rows?.[0] as Employee;
      if (!row) {
        return `No se actualizó a ningún empleado. El Id de empleado: ${id} no existe.`;
      }

      const { JOB_ID: oldJobId, DEPARTMENT_ID: oldDeptId } = row;

      // 2. Si cambiaron, actualizar job_history
      if (
        (data.JOB_ID && data.JOB_ID !== oldJobId) ||
        (data.DEPARTMENT_ID && data.DEPARTMENT_ID !== oldDeptId)
      ) {
        await this.connection.execute(
          `UPDATE job_history
         SET job_id = COALESCE(:jobId, job_id),
             department_id = COALESCE(:deptId, department_id)
         WHERE employee_id = :id
           AND (end_date IS NULL OR end_date = (
             SELECT MAX(end_date) FROM job_history WHERE employee_id = :id
           ))`,
          {
            jobId: data.JOB_ID ?? null,
            deptId: data.DEPARTMENT_ID ?? null,
            id,
          },
        );
      }

      // 3. Actualizar tabla employees
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
        { autoCommit: true },
      );

      await this.connection.commit();
      return `Se Actualizó sin inconvenientes el empleado de Id: ${id}`;
    } catch (error) {
      console.error('Error al actualizar empleado:', error);

      try {
        await this.connection.execute(
          `INSERT INTO log_errors (table_name, log_date, error_code, error_message, nota)
         VALUES ('hr.employees', SYSDATE, :errorCode, :errorMessage, :nota)`,
          {
            errorCode: error.errorNum || -1,
            errorMessage:
              error.message?.substring(0, 200) || 'Error desconocido',
            nota: 'hr.ACTUALIZACION_EMPLOYEE',
          },
          { autoCommit: true },
        );
      } catch (logError) {
        console.error('Error al registrar en log_errors:', logError);
      }

      throw new Error(
        'Error al intentar actualizar el empleado. Ver logs para más información.',
      );
    }
  }
}
