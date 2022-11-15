import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/core/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserTokenDto } from '../../core/user/dto/user-token.dto'

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
        userId: '8dc24867-7961-44d6-b75e-c917a96a1c1b', //'cfce047b-24cf-4f68-bea4-565b0413f81b',
      };
    } else if (_username === 'jw' && pass === '1234') {
      console.log(`login Successed!`);
      return {
        username: _username,
        userId: 'f8d0d022-8bb3-4784-ace0-79a3d7526c31', //'cfce047b-24cf-4f68-bea4-565b0413f81b',
      };
    } else {
      return null;
    }
  }

  verifyToken(jwt: string): UserTokenDto {
    const decodedToken =  this.jwtService.verify(jwt);
    return {
      username: decodedToken.username,
      userId: decodedToken.sub,
    };
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
