// messaging.module.ts
import { Module } from '@nestjs/common';
import { WhatsappQueueService } from './whatsapp-queue.service';
import { MessagingController } from './messaging.controller';

@Module({
  controllers: [MessagingController],
  providers: [WhatsappQueueService],
  exports: [WhatsappQueueService],
})
export class MessagingModule {}
