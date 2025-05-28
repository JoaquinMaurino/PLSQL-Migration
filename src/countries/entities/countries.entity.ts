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
  IsString,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { Location } from '../../locations/entities/locations.entity';
import { Region } from '../../regions/entities/regions.entity'; // si luego crearás esta entidad

@Entity({ name: 'COUNTRIES', schema: 'HR' })
export class Country {
  @PrimaryColumn({ name: 'COUNTRY_ID', type: 'char', length: 2 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  COUNTRY_ID: string;

  @Column({ name: 'COUNTRY_NAME', type: 'varchar', length: 60, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  COUNTRY_NAME?: string;

  @Column({ name: 'REGION_ID', type: 'number', nullable: true })
  @IsOptional()
  @IsNumber()
  REGION_ID?: number;

  // Relaciones

  @OneToMany(() => Location, (location) => location.country)
  locations: Location[];

  @ManyToOne(() => Region, (region) => region.countries, { nullable: true })
  @JoinColumn({ name: 'REGION_ID' })
  region?: Region;
}
