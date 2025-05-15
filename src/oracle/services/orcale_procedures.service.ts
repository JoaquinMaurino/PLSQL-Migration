import { Injectable, Inject } from '@nestjs/common';
import * as oracledb from 'oracledb';

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
        {
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT}
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
}
