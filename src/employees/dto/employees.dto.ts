import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';


export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  FIRST_NAME: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 25)
  LAST_NAME: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 25)
  EMAIL: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  PHONE_NUMBER?: string;

  @IsDateString()
  @IsNotEmpty()
  HIRE_DATE: string; // formato ISO, por ejemplo: '2024-05-15'

  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  JOB_ID: string;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0.01, { message: 'SALARY must be greater than 0' })
  SALARY?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(0.99, { message: 'COMMISSION_PCT must be between 0 and 0.99' })
  COMMISSION_PCT?: number;

  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'MANAGER_ID must be a number' },
  )
  MANAGER_ID?: number;

  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'DEPARTMENT_ID must be a number' },
  )
  DEPARTMENT_ID?: number;
}


// DTO para actualizar, todas las propiedades pasan a ser opcionales
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
