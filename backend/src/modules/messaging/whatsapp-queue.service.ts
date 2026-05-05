import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class WhatsappQueueService {
  public queue: Queue;

  constructor(private readonly prisma: PrismaService) {
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
    jobId: string;
    delay?: number;
    priority?: number;
  }) {
    const { phone, message, jobId, delay = 0, priority = 5 } = options;

    // ✅ Add to queue
    await this.queue.add(
      'send-message',
      { phone, message, jobId },
      {
        jobId,        // ensures de-duplication at queue level
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        delay,
        priority,
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return { jobId, status: 'queued' };
  }
}