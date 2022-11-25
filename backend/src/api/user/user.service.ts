import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../core/user/user.entity';
import { UserRepository } from '../../core/user/user.repository';
import { SearchUserDto } from '../../core/user/dto/search-user.dto';
import { UpdateUserDto } from '../../core/user/dto/update-user.dto';
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
    userToken,
    updateUserData: UpdateUserDto,
  ): Promise<User> {
    if (updateUserData.username) {
      if (updateUserData.username == userToken.username) {
        throw new BadRequestException('같은 username으로 변경할 수 없습니다.');
      }
      const user = await this.findUserByUserName(updateUserData.username);
      console.log(user);
      if (user.isExistUser) {
        throw new BadRequestException('이미 존재하는 username');
      }
    }
    await this.userRepository.update(userToken.id, updateUserData);
    return this.findUserById(userToken.id);
  }

  async findFriends(userToken): Promise<Friend[]> {
    return await this.friendRespository.find({
      relations: ['userId', 'userFriendId'],
      where: [
        { userId: { id: userToken.id } },
        { userFriendId: { id: userToken.id } },
      ],
    });
  }

  async requestFriend(userId: User, friendId: string): Promise<Friend> {
    const user = await this.findUserById(String(userId));
    if (!user) {
      throw new BadRequestException('존재하지 않는 유저');
    }
    const friend = await this.findUserById(String(friendId));
    if (!user || !friend) {
      throw new BadRequestException('존재하지 않는 친구');
    }
    if (String(userId) === String(friendId)) {
      throw new BadRequestException('userId === friendId');
    }

    const friendship = await this.friendRespository.findFriendByUsers(
      String(userId),
      String(friendId),
    );

    if (friendship?.acceptAt) {
      throw new BadRequestException('이미 친구 입니다');
    } else if (
      !friendship?.acceptAt &&
      friendship?.userId.id === String(userId)
    ) {
      throw new BadRequestException('이미 친구 신청이 되어있습니다');
    } else if (
      !friendship?.acceptAt &&
      friendship?.userFriendId.id === String(userId)
    ) {
      await this.friendRespository.update(friendship.id, {
        acceptAt: () => 'CURRENT_TIMESTAMP',
      });
      return friendship;
    }
    return this.friendRespository.createFriend(user, friend);
  }

  async acceptFriend(userToken, friendId: string): Promise<Friend> {
    const friendship = await this.friendRespository.findOne({
      relations: ['userId', 'userFriendId'],
      where: { userId: { id: friendId }, userFriendId: { id: userToken.id } },
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

  async blockUser(userToken, blockId: string) {
    if (userToken.id === blockId) {
      throw new BadRequestException('userId === blockId');
    }
    const blockUser = await this.findUserById(blockId);
    if (!blockUser) {
      throw new BadRequestException('존재하지 않는 유저');
    }
    const block = await this.blockRepository.findOne({
      relations: ['userId', 'blockedUserId'],
      where: { userId: { id: userToken.id }, blockedUserId: { id: blockId } },
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

    const user = await this.findUserById(userToken.id);
    return this.blockRepository.createBlock(user, blockUser);
  }

  async unblockUser(userToken, blockId: string) {
    if (userToken.id === blockId) {
      throw new BadRequestException('userId === blockId');
    }
    const blockUser = await this.findUserById(blockId);
    if (!blockUser) {
      throw new BadRequestException('존재하지 않는 유저');
    }
    const block = await this.blockRepository.findOne({
      relations: ['userId', 'blockedUserId'],
      where: { userId: { id: userToken.id }, blockedUserId: { id: blockId } },
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

  async blockUserFromService(userToken, banId: string) {
    const user = await this.findUserById(userToken.id);
    if (!(user.role === UserRole.OWNER || user.role === UserRole.MODERATOR)) {
      throw new ForbiddenException('권한이 없습니다');
    }
    if (userToken.id === banId) {
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

  async findChannelByParticipant(userToken) {
    const user = await this.findUserById(userToken.id);
    if (user.role === UserRole.OWNER || user.role === UserRole.MODERATOR) {
      return this.channelRepository.find();
    }
    const joinChannels = await this.channelMemberRepository.find({
      relations: ['userId', 'channelId'],
      where: {
        userId: { id: userToken.id },
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
