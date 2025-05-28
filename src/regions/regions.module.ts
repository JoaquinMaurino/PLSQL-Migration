import { Module } from '@nestjs/common';
import { RegionsController } from './controller/regions.controller';
import { RegionsService } from './service/regions.service';

@Module({
  controllers: [RegionsController],
  providers: [RegionsService]
})
export class RegionsModule {}
