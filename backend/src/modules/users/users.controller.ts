import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decortor';

@Controller('users')
export class UsersController {

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return {
      message: 'Protected route',
      user: req.user,
    };
  }

  // ✅ Public route
  @Get('allUsersß')
  getAllUsers() {
    return [{ id: 1, email: 'test@example.com' }];
  }

  // 🔒 Admin-only route
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin-only')
  getAdminData() {
    return { message: 'Admin access only' };
  }
}
