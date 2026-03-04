import { Worker } from 'bullmq';
import axios from "axios";

export const whatsappWorker = new Worker(
  'whatsapp',
  async job => {
    const { phone, message } = job.data;
    console.log('Sending message to:', job.data.phone);


    await axios.post(
    `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: message },
    },
    {
        headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
        },
    }
    );

  },
  { 
    connection: {
      host: process.env.REDIS_HOST || 'redis',
      port: 6379,
    },
  },
);