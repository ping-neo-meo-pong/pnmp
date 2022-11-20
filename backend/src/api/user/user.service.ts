import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../core/user/user.entity';
import { UserRepository } from '../../core/user/user.repository';
import { SearchUserDto } from '../../core/user/dto/search-user.dto';
import { UpdateUserDto } from '../../core/user/dto/update-user.dto';
import { Like } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async findUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserById(userId: string): Promise<User> {
    return await this.userRepository.findOneBy({ id: userId });
  }

  async findUserByUserName(username: string) {
    const user = await this.userRepository.findOneBy({ username: username });
    if (user) {
      return { isExistUser: true };
    }
    return { isExistUser: false };
  }

  async searchUsers(userSearchData: SearchUserDto): Promise<User[]> {
    if (!userSearchData.username) {
      return await this.userRepository.find();
    }
    return await this.userRepository.find({
      where: { username: Like(`%${userSearchData.username}%`) },
    });
  }

  async updateUserById(userId: string, updateUserData: UpdateUserDto) {
    if (
      updateUserData.username &&
      (await this.findUserByUserName(updateUserData.username)).isExistUser
    ) {
      new BadRequestException('이미 존재하는 username');
    }
    await this.userRepository.update(userId, updateUserData);
    return this.findUserById(userId);
  }
}
