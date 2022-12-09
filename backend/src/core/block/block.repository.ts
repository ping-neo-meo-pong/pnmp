import { Repository, IsNull, Not } from 'typeorm';
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

  async getBlockUsers(userId: string) {
    return await this.find({
      relations: ['userId', 'blockedUserId'],
      where: {
        userId: {
          id: userId,
        },
        blockAt: Not(IsNull()),
      },
    });
  }

  async didUserBlockOther(userId: string, otherId: string) {
    return await this.findOne({
      relations: ['userId', 'blockedUserId'],
      where: {
        userId: {
          id: userId,
        },
        blockedUserId: {
          id: otherId,
        },
        blockAt: Not(IsNull()),
      },
    });
  }
}
