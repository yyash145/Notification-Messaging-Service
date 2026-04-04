import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AdminCreateUserDto } from './dto/adminCreateUser.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserOrThrow(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ✅ Find by Email
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // ✅ Find by ID
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // ✅ Get all users
  async findAll() {
    return this.prisma.user.findMany();
  }

  // ✅ Create user
  async create(user: {
    email: string;
    password: string;
    name: string;
    role?: Role;
  }) {
    return this.prisma.user.create({
      data: user,
    });
  }

  // ✅ Update user
  async update(id: string, data: Partial<any>) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // ✅ Delete user
  async delete(id: string, currentUserId: string) {
    // 🚫 Prevent self delete
    if (id === currentUserId) {
      throw new BadRequestException(
        'You cannot delete your own account',
      );
    }

    const userToDelete = await this.findById(id);

    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }

    if (userToDelete.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('Cannot delete SUPER_ADMIN');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  // ✅ Save (update full object)
  async save(user: any) {
    return this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
  }

  // ✅ Count users
  async countUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  // ✅ Admin: Set role
  async setUserRoleByAdmin(dto: AdminCreateUserDto) {
    const existing = await this.findById(dto.id);

    if (!existing) {
      return {
        message: `User doesn't exist.`,
      };
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: dto.id },
      data: {
        role: dto.role,
      },
    });

    return {
      message: `Set role to ${dto.role} successfully.`,
      user: updatedUser,
    };
  }

  // ✅ Remove all users except current
  async removeAllUsers(currentUserId: string) {
    return this.prisma.user.deleteMany({
      where: {
        NOT: {
          id: currentUserId,
        },
      },
    });
  }
}