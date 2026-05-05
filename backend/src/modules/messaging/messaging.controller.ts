import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappProducerService } from './whatsapp-producer.service';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly producer: WhatsappProducerService) {}

  @Post('send')
  async sendWhatsapp(
    @Body()
    body: {
      phone: string;
      message: string;
      jobId: string,
      delay?: number;
      priority?: number;
    },
  ) {
    return this.producer.sendMessage(
      String(body.phone),
      body.message,
      body.jobId,
      body.delay,
      body.priority,
    );
  }
}