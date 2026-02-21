import { Controller, Post, Body, UnauthorizedException, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto.email, dto.password);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req) {
    // req.user comes from LocalStrategy
    return this.authService.login(req.user);
  }

  // @Post('refresh')
  // async refresh(@Body() dto) {
  //   const user = await this.usersService.findById(dto.userId);
  //   if (!user || !user.refreshToken) throw new UnauthorizedException();
    
  //   const valid = await bcrypt.compare(dto.refreshToken, user.refreshToken);
  //   if (!valid) throw new UnauthorizedException();

  //   return this.generateAccessToken(user);
  // }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  refresh(@Req() req) {
    return this.authService.login(req.user);
  }
}
