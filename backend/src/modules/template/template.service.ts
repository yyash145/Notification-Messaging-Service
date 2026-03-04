import { Injectable } from "@nestjs/common";
import { CreateTemplateDto } from "./dto/CreateTemplateDto";
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

  async createUserTemplate(dto: CreateTemplateDto, userId: string) {
    return await this.prisma.template.create({
      data: {
        displayName: dto.displayName,
        whatsappTemplateName: dto.whatsappTemplateName,
        category: 'USER',
        createdByUserId: userId,
      },
    });
  }

  async createGlobalTemplate(dto: CreateTemplateDto, userId: string) {
    return await this.prisma.template.create({
      data: {
        displayName: dto.displayName,
        whatsappTemplateName: dto.whatsappTemplateName,
        category: 'GLOBAL',
        createdByUserId: userId,
        variables: ["otp"],
      },
    });
  }

  async findTemplates(userId: string){
    return await this.prisma.template.findMany({
      where: {
        isActive: true,
        OR: [
          { category: "GLOBAL" },
          { createdByUserId: userId },
        ],
      },
    });
  }
  
  async findUniqueTemplate(templateId){
    return await this.prisma.template.findUnique({
      where: { id: templateId },
    });
  }
}

