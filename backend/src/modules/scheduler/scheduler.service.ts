import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';
import { WhatsappQueueService } from '../messaging/whatsapp-queue.service';
import { MessageStatus } from '@prisma/client';

@Injectable()
export class SchedulerService {
  constructor(
    private prisma: PrismaService,
    private whatsappQueue: WhatsappQueueService,
  ) {}

  @Cron('*/30 * * * * *') // every 30 seconds
  async processPendingMessages() {
    const now = new Date();

    const messages = await this.prisma.message.findMany({
      where: {
        status: MessageStatus.QUEUED,
        OR: [
          { scheduledAt: null },
          { scheduledAt: { lte: now } },
        ],
      },
      take: 50, // batch processing
    });

    for (const msg of messages) {
      try {
        await this.whatsappQueue.queue.add('send-message', {
          phone: msg.phone,
          message: msg.content,
          jobId: msg.jobId,
        });

        // mark as queued
        await this.prisma.message.update({
          where: { id: msg.id },
          data: { status: 'QUEUED' },
        });

      } catch (err) {
        await this.prisma.message.update({
          where: { id: msg.id },
          data: {
            status: 'FAILED',
            error: "Failed Scheduler Service",
          },
        });
      }
    }

    console.log(`Processed ${messages.length} messages`);
  }
}