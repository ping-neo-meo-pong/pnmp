import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/core/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, accessToken: string): Promise<any> {
    console.log('validateUser');
    const existUser = await this.userRepository.findOneBy({
      email: email,
    });

    if (existUser) {
      return {
        id: existUser.id,
        username: existUser.username,
        firstLogin: false,
      };
    }

    const fourtyTwo = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(fourtyTwo);

    // const newUser = this.userRepository.create({
    //   username: fourtyTwo.data.login,
    //   email: email,
    // });
    // const saveUser = await this.userRepository.save(newUser);
    // return { id: saveUser.id, username: saveUser.username, firstLogin: true };
    return { firstLogin: true };
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
