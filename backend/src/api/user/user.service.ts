import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../core/user/user.entity';
import { UserRepository } from '../../core/user/user.repository';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FriendRespository } from '../../core/friend/friend.repository';
import { BlockRepository } from '../../core/block/block.repository';
import { ChannelMemberRepository } from '../../core/channel/channel-member.repository';
import { GameHistoryRepository } from '../../core/game/game-history.repository';
import { GameHistory } from '../../core/game/game-history.entity';
import { FriendStatus } from '../../enum/friend-status';
import { Block } from '../../core/block/block.entity';
import { ChannelRepository } from '../../core/channel/channel.repository';
import { authenticator } from 'otplib';
import { ChannelInfoDto } from '../channel/dto/channel-info.dto';
import { Channel } from 'src/core/channel/channel.entity';
import { UserChannelInfoDto } from './dto/user-channel-info.dto';
import { ChannelMember } from '../../core/channel/channel-member.entity';
import { SuccessOrFailDto } from '../dto/success-or-fail.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UserBlockInfoDto } from './dto/user-block-info.dto';
import { UserFriendInfoDto } from './dto/user-friend-info.dto';
import { Friend } from '../../core/friend/friend.entity';
import { UserGameRoomDto } from './dto/user-game-room.dto';
import { GameRoom } from 'src/core/game/game-room.entity';

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

  changeUserInfo(oldInfo: User) {
    const newInfo: UserInfoDto = new UserInfoDto();
    newInfo.id = oldInfo.id;
    newInfo.username = oldInfo.username;
    newInfo.profileImage = oldInfo.profileImage;
    newInfo.status = oldInfo.status;
    newInfo.ladder = oldInfo.ladder;
    return newInfo;
  }

  async findUsers(findUserData: FindUserDto): Promise<UserInfoDto[]> {
    let users: User[];
    if (!findUserData.username) {
      users = await this.userRepository.find();
    } else {
      users = await this.userRepository.findUserIncludingUserName(
        findUserData.username,
      );
    }
    const newUsers: UserInfoDto[] = [];
    users.map((user) => {
      newUsers.push(this.changeUserInfo(user));
    });
    return newUsers;
  }

  async updateUserById(
    userId: string,
    updateUserData: UpdateUserDto,
  ): Promise<UserInfoDto> {
    const trimUserName = updateUserData.username.trim();
    const regex = /[^가-힣\w\s]/g;
    if (trimUserName === '' || trimUserName.length > 10) {
      throw new BadRequestException('잘못된 이름입니다.');
    } else if (regex.test(trimUserName) === true) {
      throw new BadRequestException(
        '특수문자가 포함되있거나 잘못된 이름입니다.',
      );
    }

    const user = await this.userRepository.findUserById(userId);
    if (updateUserData.username) {
      const trimUserName = updateUserData.username.trim();
      const regex = /[^가-힣\w\s]/g;
      if (trimUserName === '' || trimUserName.length > 10) {
        throw new BadRequestException('잘못된 이름입니다.');
      } else if (regex.test(trimUserName) == true) {
        throw new BadRequestException(
          '특수문자가 포함되있거나 잘못된 이름입니다.',
        );
      }
      console.log(`regex test:`);
      console.log(regex.test(trimUserName));
      if (trimUserName === user.username) {
        throw new BadRequestException('같은 username으로 변경할 수 없습니다.');
      }
      const isExistUser = await this.userRepository.findUserByUserName(
        updateUserData.username,
      );
      if (isExistUser) {
        throw new BadRequestException('이미 존재하는 username');
      }
    }

    if (updateUserData.twoFactorAuth) {
      const isVerified = authenticator.verify({
        token: updateUserData.otp,
        secret: user.twoFactorAuthSecret,
        // secret: 'EVCDKZCJIJCQGOIW',
      });
      if (!isVerified) {
        throw new BadRequestException('invalid otp');
      }
    }

    const { otp, ...realUserData } = updateUserData;

    await this.userRepository.update(userId, realUserData);
    return this.changeUserInfo(await this.userRepository.findUserById(userId));
  }

  async updateUserProfileImageById(
    userId: string,
    filename: string,
  ): Promise<UserInfoDto> {
    await this.userRepository.update(userId, {
      profileImage: filename ? `http://localhost/server/${filename}` : null,
    });
    return this.changeUserInfo(await this.userRepository.findUserById(userId));
  }

  async findUserByUserName(username: string) {
    const user = await this.userRepository.findUserByUserName(username);
    if (user) {
      return { isExistUser: true };
    }
    return { isExistUser: false };
  }

  changeUserFriendInfo(oldInfo: Friend) {
    const newInfo: UserFriendInfoDto = new UserFriendInfoDto();
    newInfo.id = oldInfo.id;
    newInfo.requestAt = oldInfo.requestAt;
    newInfo.acceptAt = oldInfo.acceptAt;
    newInfo.userId = this.changeUserInfo(oldInfo.userId);
    newInfo.userFriendId = this.changeUserInfo(oldInfo.userFriendId);
    return newInfo;
  }

  changeUserFriendListInfo(oldInfo: Friend[]) {
    const newInfo: UserFriendInfoDto[] = [];
    oldInfo.map((old) => {
      newInfo.push(this.changeUserFriendInfo(old));
    });
    return newInfo;
  }

  async findFriends(userId: string) {
    const friends = await this.friendRespository.findBothFriendsByUserId(
      userId,
    );
    const receiveRequest =
      await this.friendRespository.findRecieveFriendRequest(userId);
    const sendRequest = await this.friendRespository.findSendFriendRequest(
      userId,
    );
    return {
      friends: this.changeUserFriendListInfo(friends),
      receiveRequest: this.changeUserFriendListInfo(receiveRequest),
      sendRequest: this.changeUserFriendListInfo(sendRequest),
    };
  }

  async requestFriend(
    userId: string,
    friendId: string,
  ): Promise<SuccessOrFailDto> {
    const user = await this.userRepository.findUserById(userId);
    const friend = await this.userRepository.findUserById(friendId);
    if (!user || !friend) {
      throw new BadRequestException('존재하지 않는 유저');
    }
    if (userId === friendId) {
      throw new BadRequestException('자기자신에게 친구신청을 할 수 없습니다.');
    }

    const friendship = await this.friendRespository.areTheyFriends(
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
      return { success: true };
    }
    await this.friendRespository.createFriend(user, friend);
    return { success: true };
  }

  async acceptFriend(
    userId: string,
    friendId: string,
  ): Promise<SuccessOrFailDto> {
    const friendship = await this.friendRespository.haveReceiveFriendRequest(
      userId,
      friendId,
    );
    if (!friendship) {
      throw new BadRequestException('수락할 요청이 없습니다.');
    }
    if (friendship.acceptAt) {
      throw new BadRequestException('이미 친구 입니다');
    }
    await this.friendRespository.update(friendship.id, {
      acceptAt: () => 'CURRENT_TIMESTAMP',
    });
    return { success: true };
  }

  changeUserBlockInfo(oldInfo: Block) {
    const newInfo: UserBlockInfoDto = new UserBlockInfoDto();
    newInfo.id = oldInfo.id;
    newInfo.blockAt = oldInfo.blockAt;
    newInfo.userId = this.changeUserInfo(oldInfo.userId);
    newInfo.blockedUserId = this.changeUserInfo(oldInfo.blockedUserId);
    return newInfo;
  }

  async getblockUsers(userId: string): Promise<UserBlockInfoDto[]> {
    const blocks = await this.blockRepository.getBlockUsers(userId);
    const newBlocks: UserBlockInfoDto[] = [];
    blocks.map((block) => {
      newBlocks.push(this.changeUserBlockInfo(block));
    });
    return newBlocks;
  }

  async blockUser(userId: string, blockId: string): Promise<SuccessOrFailDto> {
    if (userId === blockId) {
      throw new BadRequestException('userId === blockId');
    }
    const blockUser = await this.userRepository.findUserById(blockId);
    if (!blockUser) {
      throw new BadRequestException('존재하지 않는 유저');
    }
    const block = await this.blockRepository.haveUserBlockOther(
      userId,
      blockId,
    );
    if (block?.blockAt) {
      throw new BadRequestException('이미 차단했습니다');
    }
    if (block && !block?.blockAt) {
      await this.blockRepository.update(block?.id, {
        blockAt: () => 'CURRENT_TIMESTAMP',
      });
      return { success: true };
    }

    const user = await this.userRepository.findUserById(userId);
    await this.blockRepository.createBlock(user, blockUser);
    return { success: true };
  }

  async unblockUser(
    userId: string,
    blockId: string,
  ): Promise<SuccessOrFailDto> {
    if (userId === blockId) {
      throw new BadRequestException('userId === blockId');
    }
    const blockUser = await this.userRepository.findUserById(blockId);
    if (!blockUser) {
      throw new BadRequestException('존재하지 않는 유저');
    }
    const block = await this.blockRepository.haveUserBlockOther(
      userId,
      blockId,
    );
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

  changeChannelInfo(oldInfo: Channel) {
    const newInfo: ChannelInfoDto = new ChannelInfoDto();
    newInfo.id = oldInfo.id;
    newInfo.channelName = oldInfo.channelName;
    newInfo.description = oldInfo.description;
    newInfo.hasPassword = oldInfo.password === null ? false : true;
    newInfo.isPublic = oldInfo.isPublic;
    return newInfo;
  }

  changeUserChannelInfo(oldInfo: ChannelMember) {
    const newInfo: UserChannelInfoDto = new UserChannelInfoDto();
    newInfo.id = oldInfo.channelId.id;
    newInfo.channelName = oldInfo.channelId.channelName;
    newInfo.description = oldInfo.channelId.description;
    newInfo.hasPassword = oldInfo.channelId.password === null ? false : true;
    newInfo.isPublic = oldInfo.channelId.isPublic;
    newInfo.userRoleInChannel = oldInfo.roleInChannel;
    newInfo.userMute = oldInfo.muteEndAt < new Date() ? false : true;
    return newInfo;
  }

  async acceptChannelInvite(
    userId: string,
    channelId: string,
  ): Promise<SuccessOrFailDto> {
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
    return { success: true };
  }

  async findChannelByParticipant(userId: string) {
    const joinChannels =
      await this.channelMemberRepository.getChannelsJoinCurrently(userId);
    const channels: UserChannelInfoDto[] = [];
    joinChannels.map((channel) => {
      channels.push(this.changeUserChannelInfo(channel));
    });
    const inviteChannels =
      await this.channelMemberRepository.getIniviteChannels(userId);
    const inivite: ChannelInfoDto[] = [];
    inviteChannels.map((channel) => {
      inivite.push(this.changeChannelInfo(channel.channelId));
    });
    return { channels: channels, invite: inivite };
  }

  async getFriendStatus(
    userId: string,
    friendId: string,
  ): Promise<FriendStatus> {
    const friendship = await this.friendRespository.areTheyFriends(
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

  async getBlockStatus(userId: string, blockId: string): Promise<boolean> {
    const block = await this.blockRepository.findOne({
      relations: ['userId', 'blockedUserId'],
      where: { userId: { id: userId }, blockedUserId: { id: blockId } },
    });
    if (block?.blockAt) {
      return true;
    }
    return false;
  }

  changeGameRoomInfo(oldInfo: GameRoom) {
    const newInfo: UserGameRoomDto = new UserGameRoomDto();
    newInfo.id = oldInfo.id;
    newInfo.gameMode = oldInfo.gameMode;
    newInfo.startAt = oldInfo.startAt;
    newInfo.endAt = oldInfo.endAt;
    return newInfo;
  }

  async userProfile(loginId: string, userId: string) {
    const user = await this.userRepository.findUserById(userId);
    const userGameHistory = await this.gameHistoryRepository.findGameHistorys(
      userId,
    );
    const userWins = await this.gameHistoryRepository.findWonGameHistorys(
      userId,
    );
    const gameRooms = userGameHistory.map(
      (gameRoom) => gameRoom?.gameRoomId?.id,
    );
    let otherGameHistory = [];
    if (gameRooms.length > 0) {
      otherGameHistory =
        await this.gameHistoryRepository.findGameHistorysOfOther(
          userId,
          gameRooms,
        );
    }
    const gameHistory = new Map();
    userGameHistory.forEach((item: GameHistory) =>
      gameHistory.set(item.gameRoomId.id, {
        id: item.userId.id,
        username: item.userId.username,
        profileImage: item.userId.profileImage,
        win: item.win,
        side: item.side,
        score: item.score,
        ladder: item.ladder,
      }),
    );
    otherGameHistory.forEach((item: GameHistory) =>
      gameHistory.set(item.gameRoomId.id, {
        gameRoom: this.changeGameRoomInfo(item.gameRoomId),
        user: gameHistory.get(item.gameRoomId.id),
        other: {
          id: item.userId.id,
          username: item.userId.username,
          profileImage: item.userId.profileImage,
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
        ...this.changeUserInfo(user),
        friendStatus: null,
        blockStatus: null,
        winLose: { allGames: userGameHistory.length, wins: userWins.length },
        matchHistory: gameHistories,
      };
    }

    const friendStatus = await this.getFriendStatus(loginId, userId);
    const blockStatus = await this.getBlockStatus(loginId, userId);
    return {
      ...this.changeUserInfo(user),
      friendStatus: friendStatus,
      blockStatus: blockStatus,
      winLose: { allGames: userGameHistory.length, wins: userWins.length },
      matchHistory: gameHistories,
    };
  }
}
