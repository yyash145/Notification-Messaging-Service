import { Worker } from 'bullmq';

export const whatsappWorker = new Worker(
  'whatsapp',
  async job => {
    console.log('Sending message to:', job.data.phone);

    // TODO: call WhatsApp provider here

  },
  { 
    connection: {
      host: process.env.REDIS_HOST || 'redis',
      port: 6379,
    },
  },
);