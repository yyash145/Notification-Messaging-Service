// worker.module.ts
import { Module } from '@nestjs/common';
import { WhatsappWorkerService } from './worker.service';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [WhatsappWorkerService],
})
export class WorkerModule {}