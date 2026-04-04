import { Module } from '@nestjs/common';
import { AuditLogService } from './auditlog.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [AuditLogService, PrismaService],
  exports: [AuditLogService], // 👈 IMPORTANT
})
export class AuditLogModule {}