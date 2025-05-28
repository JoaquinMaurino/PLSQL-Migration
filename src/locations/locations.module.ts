import { Module } from '@nestjs/common';
import { LocationsService } from './service/locations.service';
import { LocationsController } from './controller/locations.controller';

@Module({
  providers: [LocationsService],
  controllers: [LocationsController]
})
export class LocationsModule {}
