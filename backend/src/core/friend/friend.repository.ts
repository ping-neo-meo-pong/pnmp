import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { User } from '../user/user.entity';

@CustomRepository(Friend)
export class FriendRespository extends Repository<Friend> {
  async createFriend(user: User, userFriend: User): Promise<Friend> {
    const friend = this.create({ userId: user, userFriendId: userFriend });
    await this.save(friend);
    return friend;
  }

  async findFriendByUsers(userId, friendId): Promise<Friend> {
    return await this.findOne({
      relations: ['userId', 'userFriendId'],
      where: [
        { userId: { id: userId }, userFriendId: { id: friendId } },
        { userId: { id: friendId }, userFriendId: { id: userId } },
      ],
    });
  }
}
