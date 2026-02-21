import { Injectable } from '@nestjs/common';

@Injectable()
export class ExcelService {
  async processExcel(file: Express.Multer.File, userId: string) {
    // 1. Parse Excel
    // 2. Insert only new rows
    // 3. Associate rows with userId
    // 4. Apply cleanup rules
    return {
      message: 'Excel processed successfully',
      userId,
      fileName: file.originalname,
    };
  }
}
