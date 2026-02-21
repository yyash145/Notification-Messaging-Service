import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

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

  save(user: User) {
    return this.repo.save(user); // ✅ persists any updates
  }
}
