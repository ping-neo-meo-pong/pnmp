import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/core/user/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(_username: string, pass: string): Promise<any> {
    if (_username === 'kingminsik' && pass === '1234') {
      // login_check
      console.log(`login Successed!`);
      return {
        username: _username,
        userId: 'cfce047b-24cf-4f68-bea4-565b0413f81b',
      };
    } else {
      return null;
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
