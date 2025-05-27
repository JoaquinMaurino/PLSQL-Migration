import { Module } from '@nestjs/common';
import { CountriesController } from './controller/countries.controller';
import { CountriesService } from './service/countries.service';

@Module({
  controllers: [CountriesController],
  providers: [CountriesService]
})
export class CountriesModule {}
