import { Module } from '@nestjs/common';
import { JobsController } from './controller/jobs.controller';
import { JobsService } from './service/jobs.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule {}
