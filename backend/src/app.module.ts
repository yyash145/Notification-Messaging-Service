import { Module } from '@nestjs/common';

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
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { typeOrmConfig } from './database/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UsersModule,
    PermissionsModule,
    PlansModule,
    ExcelModule,
    SchedulerModule,
    MessagingModule,
    BillingModule,
    RetentionModule,
    HealthModule,
  ],
})
export class AppModule {}
