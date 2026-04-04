import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { REQUIRED_COLUMNS } from '../constants/upload.constants';
import { WhatsappQueueService } from '../messaging/whatsapp-queue.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuditLogService } from '../auditLog/auditlog.service';
import { MessageStatus } from '@prisma/client';

@Injectable()
export class UploadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappQueue: WhatsappQueueService,
    private readonly auditLogService: AuditLogService, // 👈 inject
  ) {}

  parseExcel(file: Express.Multer.File): any[] {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0]; // first sheet
    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet);

    return data;
  }

  async processUpload(file: Express.Multer.File, user: any) {
    const rows = this.parseExcel(file); // your logic
    this.validateColumns(rows);

    for (const row of rows) {
      const jobId = `${row.Contact}-${Date.now()}`;

      // ✅ Step 1: Save Message to the DB
      const data: any = {
        phone: String(row.Contact),
        content: row.Message,
        status: MessageStatus.QUEUED,
        jobId,
        scheduledAt: new Date(row.Date) || new Date(Date.now()) || null,
      };

      // ✅ Add ONLY if present
      if (user?.organizationId) {
        data.organizationId = user.organizationId;
      } else if (user?.userId) {
        data.userId = user.userId;
      } else {
        throw new BadRequestException('User not found in request ❌');
      }
      const message = await this.prisma.message.create({ data });

      // ✅ Step 2: Push to Queue
      await this.whatsappQueue.queue.add(
        'send-message',
        {
          phone: row.Contact,
          message: row.Message,
          jobId,
        }
      );

      // ✅ Step 3: Audit Log
      await this.auditLogService.logMessageSent(user.userId, message.id);
    }
  }

  private validateColumns(data: any[]) {
    data.forEach((row, index) => {
      REQUIRED_COLUMNS.forEach((col) => {
        if (!row[col]) {
          throw new BadRequestException(
            `Row ${index + 1}: ${col} is missing ❌`
          );
        }
      });
    });
  }


}