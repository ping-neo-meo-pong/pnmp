import { Repository } from 'typeorm';
import { Block } from './block.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { User } from '../user/user.entity';

@CustomRepository(Block)
export class BlockRepository extends Repository<Block> {
  async createBlock(user: User, blockUser: User) {
    const block = this.create({
      userId: user,
      blockedUserId: blockUser,
    });
    await this.save(block);
    return block;
  }
}
