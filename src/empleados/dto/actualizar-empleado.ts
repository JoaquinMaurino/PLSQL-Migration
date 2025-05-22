export class UpdateEmployeeDto{
  FIRST_NAME?: string;
  LAST_NAME?: string;
  EMAIL?: string;
  PHONE_NUMBER?: string;
  HIRE_DATE?: string; // formato ISO (ej. '2024-05-15')
  JOB_ID?: string;
  SALARY?: number;
  COMMISSION_PCT?: number;
  MANAGER_ID?: number;
  DEPARTMENT_ID?: number;
}