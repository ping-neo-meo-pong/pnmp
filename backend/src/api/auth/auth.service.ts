import { Injectable, BadRequestException } from '@nestjs/common';
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

  async signUpUser(
    username: string,
    email: string,
    filename: string,
  ): Promise<any> {
    console.log('signUpUser');
    const existUser = await this.userRepository.findOneBy({
      username: username,
    });
    if (existUser) {
      throw new BadRequestException('중복된 유저 네임');
    }

    const newUser = this.userRepository.create({
      username: username,
      email: email,
      profileImage: filename ? `http://localhost/server/${filename}` : null,
    });
    const saveUser = await this.userRepository.save(newUser);
    return {
      id: saveUser.id,
      username: saveUser.username,
      profileImage: saveUser.profileImage,
      firstLogin: true,
    };
  }

  async validateUser(email: string, accessToken: string): Promise<any> {
    console.log('validateUser');
    const existUser = await this.userRepository.findOneBy({
      email: email,
    });

    if (existUser) {
      return {
        id: existUser.id,
        username: existUser.username,
        profileImage: existUser.profileImage,
        firstLogin: false,
      };
    }

    const fourtyTwo = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(fourtyTwo);
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
