// worker.module.ts
import { Module } from '@nestjs/common';
import { WhatsappWorkerService } from './worker.service';

@Module({
  providers: [WhatsappWorkerService],
})
export class WorkerModule {}