import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../core/user/user.entity';
import { UserRepository } from '../../core/user/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async findUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
