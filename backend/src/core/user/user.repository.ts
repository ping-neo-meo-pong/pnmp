import { Repository, Like } from 'typeorm';
import { User } from './user.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { authenticator } from 'otplib';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async findUserById(userId: string): Promise<User> {
    return await this.findOneBy({ id: userId });
  }

  async findUserByUserName(username: string): Promise<User> {
    return await this.findOneBy({ username: username });
  }

  async findUserIncludingUserName(username: string): Promise<User[]> {
    return await this.find({
      where: { username: Like(`%${username}%`) },
    });
  }

  async createUser(
    username: string,
    email: string,
    filename: string,
  ): Promise<User> {
    const newUser = this.create({
      username: username,
      email: email,
      profileImage: filename ? `/server/${filename}` : null,
      twoFactorAuthSecret: authenticator.generateSecret(),
    });
    return await this.save(newUser);
  }
}
