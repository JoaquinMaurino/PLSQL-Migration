import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Employee } from '../../employees/entities/employees.entity';
import { Location } from '../../locations/entities/locations.entity'; // Suponiendo que luego la crearás

@Entity({ name: 'DEPARTMENTS', schema: 'HR' })
export class Department {
  @PrimaryColumn({ name: 'DEPARTMENT_ID', type: 'number', precision: 4 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  DEPARTMENT_ID: number;

  @Column({
    name: 'DEPARTMENT_NAME',
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  DEPARTMENT_NAME: string;

  @Column({ name: 'MANAGER_ID', type: 'number', nullable: true })
  @IsOptional()
  @IsNumber()
  MANAGER_ID?: number;

  @Column({ name: 'LOCATION_ID', type: 'number', nullable: true })
  @IsOptional()
  @IsNumber()
  LOCATION_ID?: number;

  // Relaciones

  // Un departamento puede tener muchos empleados
  @OneToMany(() => Employee, (employee) => employee.DEPARTMENT)
  employees: Employee[];

  // Relación con ubicación (si decidís implementarla)
  @ManyToOne(() => Location, (location) => location.departments, {
    nullable: true,
  })
  @JoinColumn({ name: 'LOCATION_ID' })
  location?: Location;

  // Relación con el manager (que es un empleado)
  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'MANAGER_ID' })
  manager?: Employee;
}
