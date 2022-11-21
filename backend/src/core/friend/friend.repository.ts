import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { CreateFriendDto } from './dto/create-friend.dto';

@CustomRepository(Friend)
export class FriendRespository extends Repository<Friend> {
  async createFriend(createFriendData: CreateFriendDto): Promise<Friend> {
    const friend = this.create(createFriendData);
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
