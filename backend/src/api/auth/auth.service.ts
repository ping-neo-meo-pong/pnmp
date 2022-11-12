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
        userId: '8dc24867-7961-44d6-b75e-c917a96a1c1b',
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
