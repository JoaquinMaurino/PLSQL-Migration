import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Country } from '../../countries/entities/countries.entity';

@Entity({ name: 'REGIONS', schema: 'HR' })
export class Region {
  @PrimaryGeneratedColumn({ name: 'REGION_ID', type: 'number' })
  REGION_ID: number;

  @Column({ name: 'REGION_NAME', type: 'varchar', length: 25, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  REGION_NAME?: string;

  @OneToMany(() => Country, (country) => country.region)
  countries: Country[];
}
