import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ContactService {
  async sendMessage(message: string, userEmail: string, userName: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.FROM_EMAIL_ADDRESS,
      pass: process.env.FROM_EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL_ADDRESS,
    to: process.env.TO_EMAIL_ADDRESS,
    subject: 'New Contact Message',
    text: `
      Message: ${message}
      
      From: ${userName}
      Email: ${userEmail}
    `,
  });

  return { message: 'Email sent successfully' };
}
}