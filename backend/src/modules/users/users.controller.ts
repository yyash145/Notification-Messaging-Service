import { Controller, Get, UseGuards, Req, Body, Delete, Query, ParseUUIDPipe, Patch, Param } from '@nestjs/common';
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
  @Patch('setUserRole')
  setUserRole(@Body() dto: AdminCreateUserDto) {
    return this.usersService.setUserRoleByAdmin(dto);
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('removeUser/:id')
  deleteUser(
    @Param('id') id: string,
    @Req() req: any
  ) {
    return this.usersService.delete(id, req.user.userId);
  }

  @Delete('removeAllUsers')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeAllUsers(@Req() req) {
    const currentUser = req.user;
    return this.usersService.removeAllUsers(currentUser.userId);
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
