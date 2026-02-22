import { Controller, Get, Post, UseGuards, Req, Body, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decortor';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { AdminCreateUserDto } from './dto/adminCreateUser.dto';

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

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('setUserRole')
  setUserRole(@Body() dto: AdminCreateUserDto) {
    return this.usersService.setUserRoleByAdmin(dto);
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('removeUser')
  async deleteUser(@Query('id', new ParseUUIDPipe()) id: string,) {
    return this.usersService.delete(id);
  }

  @Roles(Role.SUPER_ADMIN)
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

  // Admin-only route
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin-only')
  getAdminData() {
    return { message: 'Admin access only' };
  }
}
