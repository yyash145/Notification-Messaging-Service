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

    return this.generateToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user.id, user.email);
  }

  // async login(user: User) {
  //   const accessToken = this.jwtService.sign({ sub: user.id });
  //   const refreshToken = crypto.randomUUID();

  //   user.refreshToken = await bcrypt.hash(refreshToken, 10);
  //   await this.usersService.save(user);

  //   return { accessToken, refreshToken };
  // }


  private generateToken(userId: string, email: string) {
    return {
      accessToken: this.jwtService.sign({
        sub: userId,
        email,
      }),
    };
  }
}
