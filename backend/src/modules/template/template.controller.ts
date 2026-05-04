import { Post, Body, Req, UseGuards, Controller, ForbiddenException } from '@nestjs/common';
import { CreateTemplateDto } from './dto/CreateTemplateDto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TemplateService } from './template.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decortor';
import { Role } from '@prisma/client';

@Controller('template')
export class TemplateController{
    constructor(
        private readonly templateService: TemplateService,
      ) {}

    @UseGuards(JwtAuthGuard)
    @Post('createUserTemplate')
    async createUserTemplate(
      @Body() dto: CreateTemplateDto,
      @Req() Req,
    ) {
      return this.templateService.createUserTemplate(dto, Req.user.id);
    }

    @Roles(Role.SUPER_ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('createGlobalTemplate')
    async createGlobalTemplate(
      @Body() dto: CreateTemplateDto,
      @Req() Req,
    ) {
        if (dto.category !== 'GLOBAL' && !Req.user.isAdmin) {
            throw new ForbiddenException;
        }
      return this.templateService.createUserTemplate(dto, Req.user.id);
    }

}