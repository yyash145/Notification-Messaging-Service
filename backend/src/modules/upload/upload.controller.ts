import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any // 👈 get user from JWT
  ) {
    if (!file) {
      return { message: 'No file uploaded' };
    }

    await this.uploadService.processUpload(file, req.user); // ✅ CHANGE HERE

    return {
      message: 'File uploaded & saved successfully ✅',
    };
  }
}