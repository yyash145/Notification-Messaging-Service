import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'SUPER_SECRET_KEY', // move to env later
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateRefreshToken(
      payload.sub,
      payload.refreshToken,
    );
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
