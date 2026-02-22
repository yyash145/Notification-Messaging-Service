import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { AdminCreateUserDto } from './dto/adminCreateUser.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async findAll() {
    return this.repo.find();
  }

  create(user: Partial<User>) {
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: string) {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  save(user: User) {
    return this.repo.save(user); // ✅ persists any updates
  }

  async setUserRoleByAdmin(dto: AdminCreateUserDto) {
    const existing = await this.findById(dto.id);

    if (existing) {
      // ✅ Update role of existing user
      const updatedUser = await this.update(existing.id, {
        role: dto.role,
      });

      return {
        message: `Set role to ${dto.role} successfully.`,
        user: updatedUser,
      };
    }
    else {
      return {
        message: `User doesn't exists.`,
      };
    }
  }
}
