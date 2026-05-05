import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔹 Generic audit log creator
  async logAction(params: {
    userId: string;
    action: string;
    entity: string;
    entityId: string;
  }) {
    return this.prisma.auditLog.createMany({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        logRetentionDays: 5
      },
      skipDuplicates: true,
    });
  }

  // 🔹 Specific helper (optional, cleaner usage)
  async logMessageSent(userId: string, messageId: string) {
    return this.logAction({
      userId,
      action: 'SEND_MESSAGE',
      entity: 'Message',
      entityId: messageId,
    });
  }

  async logBulkMessages(userId: string, messageIds: string[]) {
  await this.prisma.auditLog.createMany({
    data: messageIds.map((id) => ({
      userId,
      action: 'SEND_MESSAGE',
      entity: 'Message',
      entityId: id,
      logRetentionDays: 5
    })),
  });
}
}