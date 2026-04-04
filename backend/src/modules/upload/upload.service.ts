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
    const parsedRows = this.parseExcel(file); // your logic

    for (const row of parsedRows) {
      const jobId = `${row.phone}-${Date.now()}`;

      // ✅ Step 1: Save Message
      const message = await this.prisma.message.create({
        data: {
          phone: row.phone,
          content: row.message,
          status: MessageStatus.QUEUED,
          jobId,
          scheduledAt: new Date(row.scheduledAt),
          ...(user.organizationId
            ? { organizationId: user.organizationId }
            : { userId: user.id }),
        },
      });

      // ✅ Step 2: Push to Queue
      await this.whatsappQueue.queue.add(
        'send-message',
        {
          phone: row.phone,
          message: row.message,
          jobId,
        }
      );

      // ✅ Step 3: Audit Log
      await this.auditLogService.logMessageSent(user, message.id);
    }
  }

  async processFile(file: Express.Multer.File) {
    let data: any[] = [];

    // ✅ Parse Excel
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(sheet);

    if (!data.length) {
      throw new BadRequestException('File is empty ❌');
    }

    // ✅ Validate columns
    this.validateColumns(data);

    // ✅ STEP 4: Schedule jobs HERE
    await this.scheduleMessages(data);

    return data;
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

  private async scheduleMessages(data: any[]) {
    for (const row of data) {
      const sendTime = new Date(row.Date);

      if (isNaN(sendTime.getTime())) {
        throw new BadRequestException(`Invalid date: ${row.Date}`);
      }

      const delay = sendTime.getTime() - Date.now();

      await this.whatsappQueue.queue.add(
        'send-message',
        {
          phone: row.Phone,
          message: row.Message,
        },
        {
          delay: Math.max(delay, 0),
        }
      );
    }
  }

}