import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Employee } from '../../employees/entities/employees.entity';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

@Entity({ name: 'JOBS', schema: 'HR' })
export class Job {
  @PrimaryColumn({ name: 'JOB_ID', type: 'varchar', length: 10 })
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  JOB_ID: string;

  @Column({ name: 'JOB_TITLE', type: 'varchar', length: 35, nullable: false })
  @IsString()
  @MaxLength(35)
  @IsNotEmpty()
  JOB_TITLE: string;

  @Column({ name: 'MIN_SALARY', type: 'number', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  MIN_SALARY?: number;

  @Column({ name: 'MAX_SALARY', type: 'number', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  MAX_SALARY?: number;

  @OneToMany(() => Employee, (employee) => employee.JOB)
  employees: Employee[];
}
