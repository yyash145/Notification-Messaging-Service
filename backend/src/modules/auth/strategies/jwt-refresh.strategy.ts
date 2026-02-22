import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'SUPER_SECRET_KEY',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.headers.authorization?.replace('Bearer ', '');

    if (!refreshToken) throw new UnauthorizedException();

    const user = await this.authService.validateRefreshToken(
      payload.sub,
      refreshToken,
    );

    if (!user) throw new UnauthorizedException();

    return user;
  }
}