// employee.repository.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
//import { Inject, Injectable } from '@nestjs/common';

//import * as oracledb from 'oracledb';

import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto/employees.dto';
import { Employee } from '../entities/employees.entity';

@Injectable()
export class EmployeesRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,
    //private readonly connection: oracledb.Connection,

    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Employee[]> {
    return await this.employeesRepo.find();
  }

  async findById(id: number): Promise<Employee | null> {
    return await this.employeesRepo.findOne({
      where: { EMPLOYEE_ID: id },
    });
  }

  async insertEmployee(data: CreateEmployeeDto): Promise<Employee> {
    // 1. Obtener el próximo ID desde la secuencia Oracle
    const nextId = await this.getNextEmployeeId();

    // 2. Crear la instancia de Employee y asignar valores
    const employee = new Employee();
    employee.EMPLOYEE_ID = nextId;
    employee.FIRST_NAME = data.FIRST_NAME;
    employee.LAST_NAME = data.LAST_NAME;
    employee.EMAIL = data.EMAIL;
    employee.PHONE_NUMBER = data.PHONE_NUMBER ?? null;
    employee.HIRE_DATE = new Date(data.HIRE_DATE);
    employee.JOB_ID = data.JOB_ID;
    employee.SALARY = data.SALARY ?? null;
    employee.COMMISSION_PCT = data.COMMISSION_PCT ?? null;
    employee.MANAGER_ID = data.MANAGER_ID ?? null;
    employee.DEPARTMENT_ID = data.DEPARTMENT_ID ?? null;

    // 3. Guardar la entidad en la base (commit implícito)
    return await this.employeesRepo.save(employee);
  }

  async deleteEmployeeById(id: number): Promise<DeleteResult | string> {
    const employee = await this.findById(id);
    if (!employee) return `Employee with ID: ${id} not found`;
    return await this.employeesRepo.delete(id);
  }

  async deleteEmployeeByEmail(email: string): Promise<DeleteResult> {
    return await this.employeesRepo.delete({
      EMAIL: email,
    });
  }

  async updateEmployee(
    id: number,
    data: UpdateEmployeeDto,
  ): Promise<Employee | null> {
    const employee = await this.findById(id);
    if (!employee) return null;
    //Actualizar solo los campos que se envian
    const updatedEmployee = this.employeesRepo.merge(employee, data);
    //Guardar cambios (commit implicito)
    return await this.employeesRepo.save(updatedEmployee);
  }

  async findJobAndDepartmentById(
    id: number,
  ): Promise<{ JOB_ID: string; DEPARTMENT_ID: number | null } | null> {
    const result = await this.employeesRepo.findOne({
      where: { EMPLOYEE_ID: id },
      select: ['JOB_ID', 'DEPARTMENT_ID'],
    });

    if (!result) return null;

    return {
      JOB_ID: result.JOB_ID,
      DEPARTMENT_ID: result.DEPARTMENT_ID ?? null,
    };
  }

  async getNextEmployeeId(): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT HR.EMPLOYEES_SEQ.NEXTVAL AS NEXTVAL FROM DUAL`,
    );

    if (!result || result.length === 0) {
      throw new Error('No se pudo obtener el ID del nuevo empleado');
    }

    const nextId = result[0].NEXTVAL;

    if (!nextId) {
      throw new Error('No se pudo obtener el ID del nuevo empleado');
    }

    return nextId;
  }

  // async logError(
  //   errorCode: number,
  //   errorMessage: string,
  //   nota: string,
  // ): Promise<void> {
  //   await this.connection.execute(
  //     `
  //     INSERT INTO log_errors (table_name, log_date, error_code, error_message, nota)
  //     VALUES ('hr.employees', SYSDATE, :error_code, :error_message, :nota)
  //     `,
  //     {
  //       error_code: errorCode,
  //       error_message: errorMessage,
  //       nota,
  //     },
  //     { autoCommit: true },
  //   );
  // }
}
