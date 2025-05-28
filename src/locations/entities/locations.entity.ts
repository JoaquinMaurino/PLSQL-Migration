import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  MaxLength,
  Min,
} from 'class-validator';
import { Department } from '../../departments/entities/departments.entity';
import { Country } from '../../countries/entities/countries.entity'; // suponiendo que luego crearás esta entidad

@Entity({ name: 'LOCATIONS', schema: 'HR' })
export class Location {
  @PrimaryColumn({ name: 'LOCATION_ID', type: 'number', precision: 4 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  LOCATION_ID: number;

  @Column({
    name: 'STREET_ADDRESS',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  STREET_ADDRESS?: string;

  @Column({ name: 'POSTAL_CODE', type: 'varchar', length: 12, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(12)
  POSTAL_CODE?: string;

  @Column({ name: 'CITY', type: 'varchar', length: 30, nullable: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  CITY: string;

  @Column({
    name: 'STATE_PROVINCE',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  STATE_PROVINCE?: string;

  @Column({ name: 'COUNTRY_ID', type: 'char', length: 2, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  COUNTRY_ID?: string;

  // Relaciones

  @OneToMany(() => Department, (department) => department.location)
  departments: Department[];

  @ManyToOne(() => Country, (country) => country.locations, { nullable: true })
  @JoinColumn({ name: 'COUNTRY_ID' })
  country?: Country;
}
