import { Injectable } from '@nestjs/common';

import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto/employees.dto';
import { Employee } from '../entities/employees.entity';
import { EmployeesRepository } from '../repository/employees.repository';

import { JobHistoryRepository } from '../../job-history/repository/job-history.repository';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeesRepo: EmployeesRepository,
    private readonly jobHistRepo: JobHistoryRepository,
  ) {}

  async getEmpleados(): Promise<Employee[]> {
    try {
      return await this.employeesRepo.findAll();
    } catch (error) {
      console.error('Error obteniendo empleados:', error);
      throw error;
    }
  }

  async getEmpleadoId(
    id: number,
  ): Promise<{ success: boolean; data: Employee | string }> {
    try {
      const employee = await this.employeesRepo.findById(id);
      if (!employee)
        return { success: false, data: `Employee with ID: ${id} not found` };
      return { success: true, data: employee };
    } catch (error) {
      const errorMessage = error.message || 'Error desconocido';
      const errorCode = error.errorNum || 0;

      // try {
      //   await this.employeeRepository.logError(
      //     errorCode,
      //     errorMessage,
      //     'NodeJS.getEmpleadoId',
      //   );
      // } catch (logError) {
      //   console.error('No se pudo registrar en log_errors:', logError);
      // }

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

    if (requiredFields.some((field) => field === null || field === undefined)) {
      return 'Para el alta de un empleado es obligatoria la carga del apellido, mail, inicio de actividad y job id';
    }

    try {
      const newEmployee = await this.employeesRepo.insertEmployee(data);

      return `Se agregó el empleado sin inconvenientes, con el ID: ${newEmployee.EMPLOYEE_ID}`;
    } catch (error: any) {
      const errorMessage = error.message || 'Error desconocido';
      const errorCode = error.errorNum || 0;

      // try {
      //   await this.employeeRepository.logError(
      //     errorCode,
      //     errorMessage,
      //     'NodeJS.altaEmpleado',
      //   );
      // } catch (logError) {
      //   console.error('No se pudo registrar en log_errors:', logError);
      // }

      throw new Error(errorMessage);
    }
  }

  async bajaEmpleadoPorId(id: number): Promise<string> {
    if (!id) {
      return 'Para eliminar un empleado el id del mismo es requerido';
    }
    try {
      await this.jobHistRepo.deleteJobHistoryByEmployeeId(id);
      await this.employeesRepo.deleteEmployeeById(id);

      return `Se elimino el empleado con id: ${id}`;
    } catch (error: any) {
      const errorMessage = error.message || 'Error desconocido';
      const errorCode = error.errorNum || 0;

      // try {
      //   await this.employeeRepository.logError(
      //     errorCode,
      //     errorMessage,
      //     'NodeJS.bajaEmpleadoPorId',
      //   );
      // } catch (logError) {
      //   console.error('No se pudo registrar en LOG_ERRORS:', logError);
      // }

      throw new Error('Falló la baja del empleado.');
    }
  }

  async bajaEmpleadoPorEmail(email: string): Promise<string> {
    if (!email) {
      return 'Para el borrado de un empleado es obligatorio el envío del email.';
    }
    try {
      await this.employeesRepo.deleteEmployeeByEmail(email);
      return `Se eliminó correctamente el empleado con email: ${email}`;
    } catch (error: any) {
      const errorMessage = error.message || 'Error desconocido';
      const errorCode = error.errorNum || 0;

      // try {
      //   await this.employeeRepository.logError(
      //     errorCode,
      //     errorMessage,
      //     'NodeJS.bajaEmpleadoPorEmail',
      //   );
      // } catch (logError) {
      //   console.error('No se pudo registrar en LOG_ERRORS:', logError);
      // }

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
      const current = await this.employeesRepo.findJobAndDepartmentById(id);

      if (!current) {
        return `No se actualizó a ningún empleado. El Id de empleado: ${id} no existe.`;
      }

      const { JOB_ID: oldJobId, DEPARTMENT_ID: oldDeptId } = current;

      const jobChanged = data.JOB_ID && data.JOB_ID !== oldJobId;
      const deptChanged =
        data.DEPARTMENT_ID && data.DEPARTMENT_ID !== oldDeptId;

      // Logica del tigger de la tabla employees que modifica la tabla job_hisotry
      if (jobChanged || deptChanged) {
        await this.jobHistRepo.updateJobHistoryIfNeeded(
          id,
          jobChanged ? data.JOB_ID : null,
          deptChanged ? data.DEPARTMENT_ID : null,
        );
      }

      await this.employeesRepo.updateEmployee(id, data);

      return `Se Actualizó sin inconvenientes el empleado de Id: ${id}`;
    } catch (error: any) {
      console.error('Error al actualizar empleado:', error);

      // try {
      //   await this.employeeRepository.logError(
      //     error.errorNum ?? -1,
      //     error.message?.substring(0, 200) ?? 'Error desconocido',
      //     'hr.ACTUALIZACION_EMPLOYEE',
      //   );
      // } catch (logError) {
      //   console.error('Error al registrar en log_errors:', logError);
      // }

      throw new Error(
        'Error al intentar actualizar el empleado. Ver logs para más información.',
      );
    }
  }
}
