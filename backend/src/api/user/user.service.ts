import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../core/user/user.entity';
import { UserRepository } from '../../core/user/user.repository';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Like, IsNull } from 'typeorm';
import { FriendRespository } from '../../core/friend/friend.repository';
import { Friend } from '../../core/friend/friend.entity';
import { BlockRepository } from '../../core/block/block.repository';
import { UserRole } from '../../enum/user-role.enum';
import { ChannelRepository } from '../../core/channel/channel.repository';
import { ChannelMemberRepository } from '../../core/channel/channel-member.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(FriendRespository)
    private friendRespository: FriendRespository,
    @InjectRepository(BlockRepository)
    private blockRepository: BlockRepository,
    @InjectRepository(ChannelRepository)
    private channelRepository: ChannelRepository,
    @InjectRepository(ChannelMemberRepository)
    private channelMemberRepository: ChannelMemberRepository,
  ) {}

  async findUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserById(userId: string): Promise<User> {
    return await this.userRepository.findOneBy({ id: userId });
  }

  async findUserByUserName(username: string) {
    const user = await this.userRepository.findOneBy({ username: username });
    if (user) {
      return { isExistUser: true };
    }
    return { isExistUser: false };
  }

  async searchUsers(userSearchData: SearchUserDto): Promise<User[]> {
    if (!userSearchData.username) {
      return await this.userRepository.find();
    }
    return await this.userRepository.find({
      where: { username: Like(`%${userSearchData.username}%`) },
    });
  }

  async updateUserById(
    userId: string,
    updateUserData: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findUserById(userId);
    if (updateUserData.username) {
      if (updateUserData.username === user.username) {
        throw new BadRequestException('같은 username으로 변경할 수 없습니다.');
      }
      const isExistUser = await this.userRepository.findOneBy({
        username: updateUserData.username,
      });
      if (isExistUser) {
        throw new BadRequestException('이미 존재하는 username');
      }
    }
    await this.userRepository.update(userId, updateUserData);
    return user;
  }

  async findFriends(userId: string): Promise<Friend[]> {
    return await this.friendRespository.find({
      relations: ['userId', 'userFriendId'],
      where: [{ userId: { id: userId } }, { userFriendId: { id: userId } }],
    });
  }

  async requestFriend(userId: string, friendId: string): Promise<Friend> {
    const user = await this.findUserById(userId);
    const friend = await this.findUserById(friendId);
    if (!user || !friend) {
      throw new BadRequestException('존재하지 않는 유저');
    }
    if (userId === friendId) {
      throw new BadRequestException('userId === friendId');
    }

    const friendship = await this.friendRespository.findFriendByUsers(
      userId,
      friendId,
    );
    if (friendship?.acceptAt) {
      throw new BadRequestException('이미 친구 입니다');
    } else if (!friendship?.acceptAt && friendship?.userId.id === userId) {
      throw new BadRequestException('이미 친구 신청이 되어있습니다');
    } else if (
      !friendship?.acceptAt &&
      friendship?.userFriendId.id === userId
    ) {
      await this.friendRespository.update(friendship.id, {
        acceptAt: () => 'CURRENT_TIMESTAMP',
      });
      return friendship;
    }
    return this.friendRespository.createFriend(user, friend);
  }

  async acceptFriend(userId: string, friendId: string): Promise<Friend> {
    const friendship = await this.friendRespository.findOne({
      relations: ['userId', 'userFriendId'],
      where: { userId: { id: friendId }, userFriendId: { id: userId } },
    });
    if (!friendship) {
      throw new BadRequestException('수락할 요청이 없습니다.');
    }
    if (friendship.acceptAt) {
      throw new BadRequestException('이미 친구 입니다');
    }
    await this.friendRespository.update(friendship.id, {
      acceptAt: () => 'CURRENT_TIMESTAMP',
    });
    return friendship;
  }

  async blockUser(userId: string, blockId: string) {
    if (userId === blockId) {
      throw new BadRequestException('userId === blockId');
    }
    const blockUser = await this.findUserById(blockId);
    if (!blockUser) {
      throw new BadRequestException('존재하지 않는 유저');
    }
    const block = await this.blockRepository.findOne({
      relations: ['userId', 'blockedUserId'],
      where: { userId: { id: userId }, blockedUserId: { id: blockId } },
    });
    if (block?.blockAt) {
      throw new BadRequestException('이미 차단했습니다');
    }
    if (block && !block?.blockAt) {
      await this.blockRepository.update(block?.id, {
        blockAt: () => 'CURRENT_TIMESTAMP',
      });
      return block;
    }

    const user = await this.findUserById(userId);
    return this.blockRepository.createBlock(user, blockUser);
  }

  async unblockUser(userId: string, blockId: string) {
    if (userId === blockId) {
      throw new BadRequestException('userId === blockId');
    }
    const blockUser = await this.findUserById(blockId);
    if (!blockUser) {
      throw new BadRequestException('존재하지 않는 유저');
    }
    const block = await this.blockRepository.findOne({
      relations: ['userId', 'blockedUserId'],
      where: { userId: { id: userId }, blockedUserId: { id: blockId } },
    });
    if (!block) {
      throw new BadRequestException('차단한 적이 없습니다.');
    }
    if (!block.blockAt) {
      throw new BadRequestException('이미 차단을 해제하였습니다.');
    }

    await this.blockRepository.update(block?.id, {
      blockAt: null,
    });
    return { success: true };
  }

  async blockUserFromService(userId: string, banId: string) {
    const user = await this.findUserById(userId);
    if (!(user.role === UserRole.OWNER || user.role === UserRole.MODERATOR)) {
      throw new ForbiddenException('권한이 없습니다');
    }
    if (userId === banId) {
      throw new BadRequestException('userId === blockId');
    }
    const banUser = await this.findUserById(banId);
    if (!banUser) {
      throw new BadRequestException('존재하지 않는 유저');
    }
    if (banUser.role === UserRole.OWNER) {
      console.log(banUser.role);
      throw new ForbiddenException('권한이 없습니다');
    } else if (banUser.role === UserRole.BAN) {
      throw new BadRequestException('이미 정지된 유저입니다');
    }
    await this.userRepository.update(banUser.id, {
      role: UserRole.BAN,
    });
    return { success: true };
  }

  async findChannelByParticipant(userId: string) {
    const user = await this.findUserById(userId);
    if (user.role === UserRole.OWNER || user.role === UserRole.MODERATOR) {
      return this.channelRepository.find();
    }
    const joinChannels = await this.channelMemberRepository.find({
      relations: ['userId', 'channelId'],
      where: {
        userId: { id: userId },
        leftAt: IsNull(),
        channelId: { deletedAt: IsNull() },
      },
    });
    const channels = joinChannels.map((channel) => {
      return {
        ...channel.channelId,
        userRoleInChannel: channel.roleInChannel,
        userBan: channel.banEndAt < new Date() ? false : true,
        userMute: channel.muteEndAt < new Date() ? false : true,
      };
    });
    console.log(channels);
    return channels;
  }
}
