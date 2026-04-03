import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { REQUIRED_COLUMNS } from '../constants/upload.constants';
import { WhatsappQueueService } from '../messaging/whatsapp-queue.service';

@Injectable()
export class UploadService {
  constructor(private readonly whatsappQueue: WhatsappQueueService) {}

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