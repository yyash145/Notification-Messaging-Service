import * as XLSX from 'xlsx';
import * as crypto from 'crypto';
import { MessageStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuditLogService } from '../auditLog/auditlog.service';
import { REQUIRED_COLUMNS } from '../constants/upload.constants';
import { Injectable, BadRequestException } from '@nestjs/common';
import { WhatsappQueueService } from '../messaging/whatsapp-queue.service';

const normalizeKey = (key: string) =>
  key.trim().toLowerCase().replace(/\s+/g, '');

@Injectable()
export class UploadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappQueue: WhatsappQueueService,
    private readonly auditLogService: AuditLogService, // 👈 inject
  ) {}

  parseExcel(file: Express.Multer.File): any[] {
    const workbook = XLSX.read(file.buffer, {
       type: 'buffer',
       cellDates: true 
      });

    const sheetName = workbook.SheetNames[0]; // first sheet
    const sheet = workbook.Sheets[sheetName];

    const rawData = XLSX.utils.sheet_to_json(sheet);

    return rawData.map((row: any) => {
      const normalizedRow: any = {};

      Object.keys(row).forEach((key) => {
        const normalizedKey = normalizeKey(key);

        if (normalizedKey.includes('date')) {
          normalizedRow.Date = row[key];
        } else if (normalizedKey.includes('name')) {
          normalizedRow.Name = row[key];
        } else if (normalizedKey.includes('contact') || normalizedKey.includes('phone')) {
          normalizedRow.Contact = row[key];
        } else if (normalizedKey.includes('message')) {
          normalizedRow.Message = row[key];
        }
      });

      return normalizedRow;
    });
  }

  async processUpload(file: Express.Multer.File, user: any) {
    const rows = this.parseExcel(file);

    if (!rows.length) {
      throw new BadRequestException('Empty file ❌');
    }

    const validData: any[] = [];
    const errors: any[] = [];

    // ✅ STEP 1: VALIDATE + PREPARE
    rows.forEach((row, index) => {
      try {
        this.validateRow(row, index);

        const scheduledAt = row.Date ? new Date(row.Date) : new Date();

        const dedupeKey = crypto
          .createHash('md5')
          .update(`${row.Contact}-${row.Message}-${scheduledAt}`)
          .digest('hex');

        const jobId = `${row.Contact}-${Date.now()}-${Math.random()}`;

        const data: any = {
          phone: String(row.Contact),
          content: row.Message,
          status: MessageStatus.QUEUED,
          scheduledAt,
          dedupeKey,
          jobId,
        };

        if (user?.organizationId) {
          data.organizationId = user.organizationId;
        } else if (user?.userId) {
          data.userId = user.userId;
        } else {
          throw new Error('User not found');
        }

        validData.push(data);
      } catch (err: any) {
        errors.push({
          row: index + 1,
          error: err.message,
        });
      }
    });

    // ✅ STEP 2: BULK INSERT
    const BATCH_SIZE = 500;

    for (let i = 0; i < validData.length; i += BATCH_SIZE) {
      const batch = validData.slice(i, i + BATCH_SIZE);

      await this.prisma.message.createMany({
        data: batch,
        skipDuplicates: true, // 🔥 dedupe
      });

      // ✅ STEP 3: FETCH ONLY INSERTED ROWS
      const insertedMessages = await this.prisma.message.findMany({
        where: {
          dedupeKey: {
            in: batch.map((b) => b.dedupeKey),
          },
        },
      });

      if (insertedMessages.length > 50000) {
        throw new BadRequestException('Max 50,000 new rows allowed ❌');
      }

      // ✅ STEP 4: PUSH TO QUEUE (ONLY INSERTED)
      for (const msg of insertedMessages) {

        await this.whatsappQueue.queue.add(
        'send-message',
        {
          phone: msg.phone,
          message: msg.content,
          jobId: msg.jobId
        }
      );

        // ✅ STEP 5: AUDIT LOG
        if (user?.userId) {
          await this.auditLogService.logMessageSent(user.userId, msg.id);
        }
      }
    }

    return {
      message:
        errors.length > 0
          ? 'File processed with some errors ⚠️'
          : 'File uploaded successfully ✅',
      totalRows: rows.length,
      success: validData.length,
      failed: errors.length,
      errors,
    };
  }

  private validateRow(row: any, index: number) {
    if (!row.Contact) {
      throw new Error(`Missing Contact at row ${index + 1}`);
    }

    if (!row.Name) {
      throw new Error(`Missing Name at row ${index + 1}`);
    }

    if (!row.Message) {
      throw new Error(`Missing Message at row ${index + 1}`);
    }

    if (row.Date && isNaN(new Date(row.Date).getTime())) {
      throw new Error('Invalid date');
    }
  }
}