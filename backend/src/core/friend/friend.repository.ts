import { Repository, Not, IsNull } from 'typeorm';
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

  async areTheyFriends(userId: string, friendId: string): Promise<Friend> {
    return await this.findOne({
      relations: ['userId', 'userFriendId'],
      where: [
        { userId: { id: userId }, userFriendId: { id: friendId } },
        { userId: { id: friendId }, userFriendId: { id: userId } },
      ],
    });
  }

  async findBothFriendsByUserId(userId: string): Promise<Friend[]> {
    return await this.find({
      relations: ['userId', 'userFriendId'],
      where: [
        { userId: { id: userId }, acceptAt: Not(IsNull()) },
        { userFriendId: { id: userId }, acceptAt: Not(IsNull()) },
      ],
    });
  }

  async findRecieveFriendRequest(userId: string): Promise<Friend[]> {
    return await this.find({
      relations: ['userId', 'userFriendId'],
      where: { userFriendId: { id: userId }, acceptAt: IsNull() },
    });
  }

  async findSendFriendRequest(userId: string): Promise<Friend[]> {
    return await this.find({
      relations: ['userId', 'userFriendId'],
      where: { userId: { id: userId }, acceptAt: IsNull() },
    });
  }

  async haveReceiveFriendRequest(
    userId: string,
    friendId: string,
  ): Promise<Friend> {
    return await this.findOne({
      relations: ['userId', 'userFriendId'],
      where: { userId: { id: friendId }, userFriendId: { id: userId } },
    });
  }
}
