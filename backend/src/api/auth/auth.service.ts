import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/core/user/user.repository';
import { JwtService } from '@nestjs/jwt';
// import { UserTokenDto } from '../../core/user/dto/user-token.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string): Promise<any> {
    console.log('validateUser');
    const existUser = await this.userRepository.findOneBy({
      userName: username,
    });

    if (existUser) {
      return { ...existUser, firstLogin: false };
    }

    const newUser = this.userRepository.create({ userName: username });
    const saveUser = await this.userRepository.save(newUser);
    return { ...saveUser, firstLogin: true };
  }

  verifyToken(jwt: string): any {
    return this.jwtService.verify(jwt);
  }

  async getToken(user: any) {
    const { firstLogin, ...payload } = user;
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
