import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decortor';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return {
      message: 'Protected route',
      user: req.user,
    };
  }

  @Roles('superadmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('getAllUsers')
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return {
      message: 'All users retrieved successfully',
      count: users.length,
      data: users,
    };
  }

  // 🔒 Admin-only route
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin-only')
  getAdminData() {
    return { message: 'Admin access only' };
  }
}
