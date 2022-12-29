import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/core/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { LoginUserInfoDto } from './dto/login-user-info.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUpUser(username: string, email: string, filename: string) {
    console.log('signUpUser');
    const existUser = await this.userRepository.findOneBy({
      username: username,
    });
    if (existUser) {
      throw new BadRequestException('중복된 유저 네임');
    }

    const regex = /[^가-힣\w\s]/g;
    const trimName = username.trim();
    if (
      trimName.length === 0 ||
      regex.test(trimName) === true ||
      trimName.length > 10
    ) {
      throw new BadRequestException('잘못된 이름');
    }

    const saveUser = await this.userRepository.createUser(
      username,
      email,
      filename,
    );
    return {
      id: saveUser.id,
      username: saveUser.username,
      profileImage: saveUser.profileImage,
      firstLogin: true,
    };
  }

  async validateUser(email: string, accessToken: string) {
    console.log('validateUser');
    if (!email) {
      return null;
    }
    const existUser = await this.userRepository.findOneBy({
      email: email,
    });

    if (existUser) {
      return {
        id: existUser.id,
        username: existUser.username,
        profileImage: existUser.profileImage,
        firstLogin: false,
        twoFactorAuth: existUser.twoFactorAuth,
      };
    }

    try {
      const fourtyTwo = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(fourtyTwo);
    } catch (e) {
      return null;
    }
    return { firstLogin: true };
  }

  verifyToken(jwt: string): LoginUserInfoDto {
    return this.jwtService.verify(jwt);
  }

  async getToken(user: LoginUserInfoDto) {
    const { firstLogin, ...payload } = user;
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
