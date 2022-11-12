import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async login() {
    return;
  }

  async logout() {
    return;
  }
}
