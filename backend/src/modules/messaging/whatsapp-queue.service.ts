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
    delay?: number;
    priority?: number;
  }) {
    const { phone, message, delay = 0, priority = 5 } = options;

    const jobId = `${String(phone)}-${Date.now()}`;

    // ✅ Save in DB
    await this.prisma.message.create({
      data: {
        jobId,
        phone,
        content: message,
        status: 'QUEUED',
      },
    });

    // ✅ Add to queue
    await this.queue.add(
      'send-message',
      { phone, message, jobId },
      {
        jobId,
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