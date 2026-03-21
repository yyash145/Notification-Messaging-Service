import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class WhatsappQueueService {
  private queue: Queue;
  prisma: any;

  constructor() {
    this.queue = new Queue('whatsapp', {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    });
  }

  async sendMessage(options: {
    phone: string;
    message: string;
    delay?: number;     // in ms
    priority?: number;  // lower = higher priority
  }) {
    const { phone, message, delay = 0, priority = 5 } = options;
    const jobId = `${phone}-${message}-${Math.floor(Date.now() / 60000)}`;

    await this.prisma.message.create({
      data: {
        jobId,
        phone,
        content: message,
        status: 'QUEUED',
      },
    });

    await this.queue.add(
      'send-message',
      { phone, message },
      {
        jobId,
        attempts: 3, // 🔁 Retry 3 times
        backoff: {
          type: 'exponential',
          delay: 5000, // 5 sec → 10 → 20...
        },
        delay,         // ⏱️ Delay support
        priority,      // 🔥 Priority support
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    console.log('📩 Job queued:', { phone, delay, priority });
  }
}