import { Module } from '@nestjs/common';
import { CountriesController } from './controller/countries/countries.controller';
import { CountriesService } from './service/countries/countries.service';

@Module({
  controllers: [CountriesController],
  providers: [CountriesService]
})
export class CountriesModule {}
