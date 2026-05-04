import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { WhatsappQueueService } from '../messaging/whatsapp-queue.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly whatsappQueue: WhatsappQueueService,
  ) {}

  async checkHealth() {
    const health: any = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'down',
        redis: 'down',
        worker: {
          status: 'down',
          waiting: 0,
          active: 0,
          failed: 0,
        },
      },
    };

    // =========================
    // ✅ DATABASE CHECK
    // =========================
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      health.services.database = 'up';
    } catch (err) {
      health.status = 'degraded';
    }

    // =========================
    // ✅ REDIS CHECK
    // =========================
    let redis;
    try {
      redis = this.redisService.getClient();
      await redis.ping();
      health.services.redis = 'up';
    } catch (err) {
      health.status = 'degraded';
    }

    // =========================
    // ✅ QUEUE STATS (Worker Activity)
    // =========================
    try {
      const queue = this.whatsappQueue.queue;

      const [waiting, active, failed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getFailedCount(),
      ]);

      health.services.worker.waiting = waiting;
      health.services.worker.active = active;
      health.services.worker.failed = failed;

      // ⚠️ Detect backlog (worker might be stuck)
      if (waiting > 50 && active === 0) {
        health.status = 'degraded';
      }

      // ⚠️ Detect high failure rate
      if (failed > 10) {
        health.status = 'degraded';
      }
    } catch (err) {
      health.status = 'degraded';
    }

    // =========================
    // ✅ WORKER LIVENESS (Heartbeat)
    // =========================
    try {
      if (redis) {
        const lastBeat = await redis.get('worker:heartbeat');

        if (lastBeat && Date.now() - Number(lastBeat) < 15000) {
            health.services.worker.status = 'up';
        } else {
            health.services.worker.status = 'down';
            health.status = 'degraded';
        }
      }
    } catch (err) {
      health.status = 'degraded';
    }

    return health;
  }
}