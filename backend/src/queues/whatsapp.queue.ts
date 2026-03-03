import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class WhatsAppQueue {
  private queue: Queue;

  constructor(private readonly redisService: RedisService) {
    this.queue = new Queue('whatsapp', {
      connection: {
        //this.redisService.getClient(),
        host: 'localhost',
        port: 6379,
      }
    });
  }

  async addReminderJob(data: any) {
    await this.queue.add('send-reminder', data);
  }
}