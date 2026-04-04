import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { PlansModule } from './modules/plans/plans.module';
import { ExcelModule } from './modules/excel/excel.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { BillingModule } from './modules/billing/billing.module';
import { RetentionModule } from './modules/retention/retention.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TemplateModule } from './modules/template/template.module';
import { UploadModule } from './modules/upload/upload.module';
import { ContactModule } from './modules/contact/contact.module';
import { AuditLogModule } from './modules/auditLog/auditlog.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,   // makes env available everywhere
    }),
    AuditLogModule,
    AuthModule,
    BillingModule,
    ContactModule,
    ExcelModule,
    HealthModule,
    MessagingModule,
    PermissionsModule,
    PlansModule,
    PrismaModule,
    RetentionModule,
    SchedulerModule,
    TemplateModule,
    UploadModule,
    UsersModule
  ],
})
export class AppModule {}
