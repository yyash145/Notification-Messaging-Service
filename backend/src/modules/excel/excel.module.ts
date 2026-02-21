// excel.module.ts
import { Module } from '@nestjs/common';
import { ExcelController } from './ecxel.controller';
import { ExcelService } from './excel.service';

@Module({
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [],
})
export class ExcelModule {}
