import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import axios from 'axios';
import { PrismaService } from 'prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class WhatsappWorkerService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService
  ) {}
  onModuleInit() {
    console.log('Worker starting...');
    this.startHeartbeat();

    const worker = new Worker(
      'whatsapp',
      async job => {
        const { phone, message, jobId } = job.data;

        console.log('Sending', message, 'to:', phone, 'from', jobId);

        try {
          await axios.post(
            `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
              messaging_product: 'whatsapp',
              to: phone,
              type: 'text',
              text: { body: message },
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json',
              },
            },
          );
          await this.prisma.message.update({
            where: { jobId },
            data: { status: 'SENT' },
          });

        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.error('❌ Send error:', error.response?.data || error.message);

            await this.prisma.message.update({
              where: { jobId },
              data: {
                status: 'FAILED',
                error: error.message,
              },
            });
          } else {
            console.error('❌ Unknown error:', error);

            await this.prisma.message.update({
              where: { jobId },
              data: {
                status: 'FAILED',
                error: 'Unknown error',
              },
            });
          }

          throw error;
        }
      },
      {
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6379,
        },
        limiter: {
          max: 10,
          duration: 1000,
        },
      },
    );

    worker.on('completed', job => {
      console.log(`✅ Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`❌ Job ${job?.id} failed:`, err.message);
    });
  }
  private startHeartbeat() {
    const redis = this.redisService.getClient();
    setInterval(async () => {
      try {
        await redis.set('worker:heartbeat', Date.now(), 'EX', 15);
      } catch (err) {
        console.error('❌ Heartbeat failed:', err);
      }
    }, 5000);
  }
}