// messaging.module.ts
import { Module } from '@nestjs/common';
import { WhatsappQueueService } from './whatsapp-queue.service';
import { MessagingController } from './messaging.controller';
import { WhatsappProducerService } from './whatsapp-producer.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MessagingController],
  providers: [
    WhatsappQueueService,
    WhatsappProducerService
  ],
  exports: [WhatsappQueueService],
})
export class MessagingModule {}
