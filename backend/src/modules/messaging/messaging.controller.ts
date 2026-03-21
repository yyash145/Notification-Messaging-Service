import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappQueueService } from './whatsapp-queue.service';

@Controller('messages')
export class MessagingController {
  constructor(private readonly queueService: WhatsappQueueService) {}

  @Post('send')
  async sendMessage(
    @Body()
    body: {
      phone: string;
      message: string;
      delay?: number;
      priority?: number;
    },
  ) {
    await this.queueService.sendMessage(body);

    return {
      status: 'queued',
      ...body,
    };
  }
}