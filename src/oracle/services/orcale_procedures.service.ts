import { Injectable, Inject } from '@nestjs/common';
import * as oracledb from 'oracledb';

import { CreateEmployeeDto } from '../dtos/alta-employee.dto';

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
export class OrcaleProceduresService {
  constructor(
    @Inject('ORACLE_CONNECTION')
    private readonly connection: oracledb.Connection,
  ) {}

  async getEmployees(): Promise<Employee[]> {
    try {
      const result = await this.connection.execute<{
        cursor: oracledb.ResultSet<Employee>;
      }>(
        `
          BEGIN
             HR.PKG_TEST_HR_PLSQL.REF_CUR_EMPLOYEES(:cursor);
          END;
        `,
        { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      if (!result.outBinds) throw new Error('outBinds.cursor is undefined');
      const resultSet = result.outBinds.cursor;
      const rows = await resultSet.getRows();
      await resultSet.close();

      return rows;
    } catch (error) {
      console.log('Error executing REF_CUR_EMPLOYEES: ', error);

      throw error;
    }
  }

  async altaEmpleado(data: CreateEmployeeDto): Promise<string> {
    try {
      const result = await this.connection.execute<{ p_sal_err: string }>(
        `
          BEGIN
            HR.PKG_TEST_HR_EMPLOY.ALTA_EMPLOYEE(
              :FIRST_NAME,
              :LAST_NAME,
              :EMAIL,
              :PHONE_NUMBER,
              :HIRE_DATE,
              :JOB_ID,
              :SALARY,
              :COMMISSION_PCT,
              :MANAGER_ID,
              :DEPARTMENT_ID,
              :p_sal_err  
            );
          END;
        `,
        {
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
          p_sal_err: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 1000,
          },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      return result.outBinds?.p_sal_err || 'Alta realizada exitosamente';
    } catch (error) {
      console.error('Error al ejecutar ALTA_EMPLOYEE:', error);
      throw error;
    }
  }

  async bajaEmpleadoPorId(employeeId: number): Promise<string> {
    try {
      console.log(employeeId);
      const result = await this.connection.execute<{
        p_nota_sal: string;
      }>(
        `
        BEGIN
          HR.PKG_TEST_HR_EMPLOY.BAJA_EMPLOYEE_ID(:p_EMPLOYEE_ID, :p_nota_sal);
        END;
      `,
        {
          p_EMPLOYEE_ID: employeeId,
          p_nota_sal: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 1000,
          },
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        },
      );
      console.log('OUTBINDS: ', result.outBinds);
      return (
        result.outBinds?.p_nota_sal ||
        'No se recibió respuesta del procedimiento.'
      );
    } catch (error) {
      console.error('Error ejecutando BAJA_EMPLOYEE_ID:', error);
      throw new Error('Falló la baja del empleado.');
    }
  }
  async bajaEmpleadoPorEmail(email: string): Promise<string> {
    try {
      const result = await this.connection.execute<{
        p_nota_sal: string;
      }>(
        `
        BEGIN
          HR.PKG_TEST_HR_EMPLOY.BAJA_EMPLOYEE_EMAIL(:p_EMAIL, :p_nota_sal);
        END;
      `,
        {
          p_EMAIL: email,
          p_nota_sal: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 1000,
          },
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        },
      );
      return (
        result.outBinds?.p_nota_sal ||
        'No se recibió respuesta del procedimiento.'
      );
    } catch (error) {
      console.error('Error ejecutando BAJA_EMPLOYEE_EMAIL:', error);
      throw new Error('Falló la baja del empleado.');
    }
  }
}
