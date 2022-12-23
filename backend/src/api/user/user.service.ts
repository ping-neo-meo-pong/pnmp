import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../core/user/user.entity';
import { UserRepository } from '../../core/user/user.repository';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Like, IsNull, In, Not } from 'typeorm';
import { FriendRespository } from '../../core/friend/friend.repository';
import { Friend } from '../../core/friend/friend.entity';
import { BlockRepository } from '../../core/block/block.repository';
import { ChannelMemberRepository } from '../../core/channel/channel-member.repository';
import { GameHistoryRepository } from '../../core/game/game-history.repository';
import { GameHistory } from '../../core/game/game-history.entity';
import { WinLose } from 'src/enum/win-lose.enum';
import { FriendStatus } from '../../enum/friend-status';
import { Block } from '../../core/block/block.entity';
import { ChannelRepository } from '../../core/channel/channel.repository';

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
    @InjectRepository(GameHistoryRepository)
    private gameHistoryRepository: GameHistoryRepository,
  ) {}

  async findUserById(userId: string): Promise<User> {
    return await this.userRepository.findOneBy({ id: userId });
  }

  async findUsers(findUserData: FindUserDto): Promise<User[]> {
    if (!findUserData.username) {
      return await this.userRepository.find();
    }
    return await this.userRepository.find({
      where: { username: Like(`%${findUserData.username}%`) },
    });
  }

  async findUserByUserName(username: string) {
    const user = await this.userRepository.findOneBy({ username: username });
    if (user) {
      return { isExistUser: true };
    }
    return { isExistUser: false };
  }

  async updateUserById(
    userId: string,
    updateUserData: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findUserById(userId);
    const trimUserName = updateUserData.username.trim();
    if (updateUserData.username) {
      if (trimUserName === user.username) {
        throw new BadRequestException('같은 username으로 변경할 수 없습니다.');
      } else if (trimUserName === '') {
        throw new BadRequestException(
          '공백으로만 이루어진 이름은 생성할 수 없습니다',
        );
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

  async findFriends(userId: string) {
    const friends = await this.friendRespository.find({
      relations: ['userId', 'userFriendId'],
      where: [
        { userId: { id: userId }, acceptAt: Not(IsNull()) },
        { userFriendId: { id: userId }, acceptAt: Not(IsNull()) },
      ],
    });
    const receiveRequest = await this.friendRespository.find({
      relations: ['userId', 'userFriendId'],
      where: { userFriendId: { id: userId }, acceptAt: IsNull() },
    });
    const sendRequest = await this.friendRespository.find({
      relations: ['userId', 'userFriendId'],
      where: { userId: { id: userId }, acceptAt: IsNull() },
    });
    return {
      friends: friends,
      receiveRequest: receiveRequest,
      sendRequest: sendRequest,
    };
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

  async getblockUsers(userId: string): Promise<Block[]> {
    const blocks = await this.blockRepository.find({
      relations: ['userId', 'blockedUserId'],
      where: { userId: { id: userId }, blockAt: Not(IsNull()) },
    });
    return blocks;
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

  async acceptChannelInvite(userId: string, channelId: string) {
    const channel = await this.channelRepository.findOneBy({ id: channelId });
    if (!channel) {
      throw new BadRequestException('존재하지 않는 채널');
    }
    const iniviteChannel =
      await this.channelMemberRepository.findIniviteChannel(userId, channelId);
    if (!iniviteChannel) {
      throw new BadRequestException('수락할 요청이 없습니다.');
    }
    await this.channelMemberRepository.update(iniviteChannel.id, {
      joinAt: () => 'CURRENT_TIMESTAMP',
      leftAt: null,
    });
    return iniviteChannel;
  }

  async findChannelByParticipant(userId: string) {
    // const user = await this.findUserById(userId);
    const joinChannels =
      await this.channelMemberRepository.getChannelsJoinCurrently(userId);
    const channels = joinChannels.map((channel) => {
      return {
        ...channel.channelId,
        userRoleInChannel: channel.roleInChannel,
        // userBan: channel.banEndAt < new Date() ? false : true,
        userMute: channel.muteEndAt < new Date() ? false : true,
      };
    });
    const inviteChannels =
      await this.channelMemberRepository.getIniviteChannels(userId);
    const inivie = inviteChannels.map((channel) => channel.channelId);
    return { channels: channels, invite: inivie };
  }

  async getFriendStatus(
    userId: string,
    friendId: string,
  ): Promise<FriendStatus> {
    const friendship = await this.friendRespository.findFriendByUsers(
      userId,
      friendId,
    );
    if (friendship?.acceptAt) {
      return FriendStatus.ALREADY;
    } else if (!friendship?.acceptAt && friendship?.userId.id === userId) {
      FriendStatus.SEND;
    } else if (
      !friendship?.acceptAt &&
      friendship?.userFriendId.id === userId
    ) {
      return FriendStatus.RECEIVE;
    }
    return FriendStatus.NONE;
  }

  async getBlockStatus(userId: string, blockId: string) {
    const block = await this.blockRepository.findOne({
      relations: ['userId', 'blockedUserId'],
      where: { userId: { id: userId }, blockedUserId: { id: blockId } },
    });
    if (block?.blockAt) {
      return true;
    }
    return false;
  }

  async userProfile(loginId: string, userId: string) {
    const user = await this.findUserById(userId);
    const userGameHistory = await this.gameHistoryRepository.find({
      relations: ['userId', 'gameRoomId'],
      where: { userId: { id: userId } },
    });
    const userWins = await this.gameHistoryRepository.find({
      relations: ['userId', 'gameRoomId'],
      where: { userId: { id: userId }, win: WinLose.WIN },
    });
    const gameRooms = userGameHistory.map(
      (gameRoom) => gameRoom?.gameRoomId?.id,
    );
    let otherGameHistory = [];
    if (gameRooms.length > 0) {
      otherGameHistory = await this.gameHistoryRepository.find({
        relations: ['userId', 'gameRoomId'],
        where: {
          gameRoomId: { id: In(gameRooms) },
          userId: { id: Not(userId) },
        },
      });
    }
    const gameHistory = new Map();
    userGameHistory.forEach((item: GameHistory) =>
      gameHistory.set(item.gameRoomId.id, {
        profile: {
          id: item.userId.id,
          username: item.userId.username,
          profileImage: item.userId.profileImage,
        },
        win: item.win,
        side: item.side,
        score: item.score,
        ladder: item.ladder,
      }),
    );
    otherGameHistory.forEach((item: GameHistory) =>
      gameHistory.set(item.gameRoomId.id, {
        gameRoom: item.gameRoomId,
        user: gameHistory.get(item.gameRoomId.id),
        other: {
          profile: {
            id: item.userId.id,
            username: item.userId.username,
            profileImage: item.userId.profileImage,
          },
          win: item.win,
          side: item.side,
          score: item.score,
          ladder: item.ladder,
        },
      }),
    );
    const gameHistories = Array.from(gameHistory.values());

    if (loginId === userId) {
      return {
        ...user,
        friendStatus: null,
        blockStatus: null,
        winLose: { allGames: userGameHistory.length, wins: userWins.length },
        matchHistory: gameHistories,
      };
    }

    const friendStatus = await this.getFriendStatus(loginId, userId);
    const blockStatus = await this.getBlockStatus(loginId, userId);
    return {
      ...user,
      friendStatus: friendStatus,
      blockStatus: blockStatus,
      winLose: { allGames: userGameHistory.length, wins: userWins.length },
      matchHistory: gameHistories,
    };
  }
}
