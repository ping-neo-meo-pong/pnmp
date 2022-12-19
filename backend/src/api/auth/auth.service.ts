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
      username: username,
    });

    if (existUser) {
      return {
        id: existUser.id,
        username: existUser.username,
        firstLogin: false,
      };
    }

    const newUser = this.userRepository.create({ username: username });
    const saveUser = await this.userRepository.save(newUser);
    return { id: saveUser.id, username: saveUser.username, firstLogin: true };
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
