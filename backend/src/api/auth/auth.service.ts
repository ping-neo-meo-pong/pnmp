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

  /*
  async validateUser(_username: string, pass: string): Promise<any> {
    if (_username === 'kingminsik' && pass === '1234') {
      return {
        username: _username,
        userId: 'cb9eb1cf-5028-4586-8a25-7a0e151fa8a5',
      };
    } else if (_username === 'jw' && pass === '1234') {
      return {
        username: _username,
        userId: '493f6c81-b287-4786-bcab-c20eb906df30',
      };
    } else {
      return null;
    }
  }
  */
  async validateUser(_username: string, pass: string): Promise<any> {
    const user = await this.userRepository.getUser(_username);
    if (!user)
      return null;

	return {
      username: user.userName,
      userId: user.id,
    };
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
