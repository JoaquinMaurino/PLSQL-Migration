import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobHistory } from './entities/job-history.entity';
import { JobHistoryController } from './controller/job-history.controller';
import { JobHistoryService } from './service/job-history.service';
import { JobHistoryRepository } from './repository/job-history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JobHistory])],
  controllers: [JobHistoryController],
  providers: [JobHistoryService, JobHistoryRepository],
  exports: [JobHistoryRepository],
})
export class JobHistoryModule {}
