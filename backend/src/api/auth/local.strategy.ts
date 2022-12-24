import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'accessToken',
      //   passReqToCallback: false,
    });
  }

  async validate(email: string, accessToken: string): Promise<any> {
    console.log('validate called');
    const user = await this.authService.validateUser(email, accessToken);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
