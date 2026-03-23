import { Injectable } from '@nestjs/common';
import { WhatsappQueueService } from './whatsapp-queue.service';

@Injectable()
export class WhatsappProducerService {
  constructor(
    private readonly whatsappQueueService: WhatsappQueueService,
  ) {}

  async sendMessage(
    phone: string,
    message: string,
    delay?: number,
    priority?: number,
  ) {
    return this.whatsappQueueService.sendMessage({
      phone,
      message,
      delay,
      priority,
    });
  }
}