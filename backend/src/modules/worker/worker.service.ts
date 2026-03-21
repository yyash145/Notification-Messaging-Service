import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import axios from 'axios';


@Injectable()
export class WhatsappWorkerService implements OnModuleInit {
  prisma: any;
  onModuleInit() {
    console.log('Worker starting...');

    const worker = new Worker(
      'whatsapp',
      async job => {
        const { phone, message, jobId } = job.data;

        console.log('Sending message to:', phone);

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

        } catch (error) {
          console.error('❌ Send failed:', error.message);

          await this.prisma.message.update({
            where: { jobId },
            data: {
              status: 'FAILED',
              error: error.message,
            },
          });

          throw error;
        }
      },
      {
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: 6379,
        },
        limiter: {    // Rate Limiter
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
}