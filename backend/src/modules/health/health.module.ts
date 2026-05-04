// health.module.ts
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { RedisModule } from 'src/redis/redis.module';
import { MessagingModule } from '../messaging/messaging.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    RedisModule,
    MessagingModule,
    PrismaModule
  ],
  controllers: [HealthController],
  providers: [HealthService]
})
export class HealthModule {}
