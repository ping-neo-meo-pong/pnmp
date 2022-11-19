import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../core/user/user.entity';
import { UserRepository } from '../../core/user/user.repository';
import { Socket } from 'socket.io';

@Injectable()
export class UserService {
  private map: Map<string, Socket>;

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    this.map = new Map<string, Socket>;
  }

  setSocket(userId: string, socket: Socket) {
    this.map.set(userId, socket);
  }

  getSocket(userId: string) {
    return this.map.get(userId);
  }

  deleteSocket(userId: string) {
    return this.map.delete(userId);
  }

  async findUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
