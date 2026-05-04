import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      retryStrategy: (times) => {
        // exponential backoff (max 2s)
        return Math.min(times * 100, 2000);
      },
    });

    // ✅ Logging (very useful for debugging)
    this.client.on('connect', () => {
      console.log('Redis connected');
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis error:', err.message);
    });

    this.client.on('close', () => {
      console.warn('⚠️ Redis connection closed');
    });
  }

  getClient(): Redis {
    return this.client;
  }

  // Optional helper (cleaner usage)
  async ping(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  // Graceful shutdown (VERY IMPORTANT in Docker)
  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      console.log('🛑 Redis connection closed');
    }
  }
}