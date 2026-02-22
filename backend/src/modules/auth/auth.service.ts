import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
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
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '15m',
      }),
    };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.validateRefreshToken(userId, refreshToken);
    if (!user) throw new UnauthorizedException();

    return this.generateAccessToken(user);
  }
}
