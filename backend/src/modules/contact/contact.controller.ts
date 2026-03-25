import { Controller, Post, Body, Req } from '@nestjs/common';
import { ContactService } from './contact.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @UseGuards(JwtAuthGuard)
  @Post('viaMail')
  async sendMessage(
    @Body() body: { message: string },
    @Req() req: any
  ) {
    const userEmail = req.user.email; // 🔥 from JWT
    const userName = req.user.name;

    return this.contactService.sendMessage(
      body.message,
      userEmail,
      userName
    );
  }
}