import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import axios from 'axios';

@Injectable()
export class WhatsappWorkerService implements OnModuleInit {
  onModuleInit() {
    console.log('Worker starting...');

    const worker = new Worker(
      'whatsapp',
      async job => {
        const { phone, message } = job.data;

        console.log('Sending message to:', phone);

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
      },
      {
        connection: {
          host: process.env.REDIS_HOST || 'redis',
          port: 6379,
        },
      },
    );

    worker.on('completed', job => {
      console.log(`Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed:`, err.message);
    });
  }
}