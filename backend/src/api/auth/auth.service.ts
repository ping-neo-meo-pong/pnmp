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

  async getToken(user: any) {
    const { firstLogin, ...payload } = user;
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
