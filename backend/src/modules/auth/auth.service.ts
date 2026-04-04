import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/entities/user.entity';
import { Role } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}


  async signup(name: string, email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCount = await this.usersService.countUsers();
    const role = userCount === 0 ? Role.SUPER_ADMIN : Role.USER;

    const user = await this.usersService.create({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      role: role,
      isActive: true,
    });

    return this.generateAccessToken(user);
  }

  async login(user: User) {
    const accessToken = this.generateAccessToken(user).accessToken;

    const refreshToken = crypto.randomUUID();
    user.refreshToken = await bcrypt.hash(refreshToken, 10);

    await this.usersService.save(user);

    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException();

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException();

    if (!user.isActive) throw new UnauthorizedException('Account disabled');

    return user;
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) return null;

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    return isValid ? user : null;
  }

  private generateAccessToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '15m',
      }),
    };
  }

  async refreshAccessToken(userId: string, refreshToken: string) {
    const user = await this.validateRefreshToken(userId, refreshToken);
    if (!user) throw new UnauthorizedException();

    const accessToken = this.generateAccessToken(user).accessToken;
    const newRefreshToken = crypto.randomUUID();

    user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.usersService.save(user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
