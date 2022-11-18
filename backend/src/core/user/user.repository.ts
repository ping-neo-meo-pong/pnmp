import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async getUser(username: string): Promise<User|null> {
    try {
      return await this.findOneBy({
        userName: username,
      });
    } catch (err) {
      return null;
    }
  }
}
