import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MessagingModule } from '../messaging/messaging.module';
import { AuditLogModule } from '../auditLog/auditlog.module';

@Module({
  imports: [
    MessagingModule, 
    AuditLogModule
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService]
})
export class UploadModule {}