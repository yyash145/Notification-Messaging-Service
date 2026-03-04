// template.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';

@Module({
  providers: [
    TemplateService,
    PrismaService
  ],
  controllers: [TemplateController]
})
export class TemplateModule {}
