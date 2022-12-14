import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ChannelRepository } from '../../core/channel/channel.repository';
import { ChannelMemberRepository } from '../../core/channel/channel-member.repository';
import { Channel } from '../../core/channel/channel.entity';
import { DataSource } from 'typeorm';
import { User } from '../../core/user/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UserRepository } from '../../core/user/user.repository';
import { ChannelPasswordDto } from './dto/channel-password.dto';
import { RoleInChannel } from 'src/enum/role-in-channel.enum';
import { ChangeRoleInChannelDto } from './dto/change-role-in-channel.dto';
import { BlockRepository } from '../../core/block/block.repository';
import { ChannelMessageRepository } from '../../core/channel/channel-message.repository';
import { ChannelInfoDto } from './dto/channel-info.dto';
import { ChannelMessageDto } from './dto/channel-message.dto';
import { ChannelMessage } from '../../core/channel/channel-message.entity';
import { SuccessOrFailDto } from '../dto/success-or-fail.dto';
import { UserInfoDto } from '../user/dto/user-info.dto';

@Injectable()
export class ChannelService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(ChannelRepository)
    private channelRepository: ChannelRepository,
    @InjectRepository(ChannelMemberRepository)
    private channelMemberRepository: ChannelMemberRepository,
    @InjectRepository(ChannelMessageRepository)
    private channelMessageRepository: ChannelMessageRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(BlockRepository)
    private blockRepository: BlockRepository,
  ) {}

  changeChannelInfo(oldInfo: Channel) {
    const newInfo: ChannelInfoDto = new ChannelInfoDto();
    newInfo.id = oldInfo.id;
    newInfo.channelName = oldInfo.channelName;
    newInfo.description = oldInfo.description;
    newInfo.hasPassword = oldInfo.password === null ? false : true;
    newInfo.isPublic = oldInfo.isPublic;
    return newInfo;
  }

  async getChannels(userId: string): Promise<ChannelInfoDto[]> {
    const joinChannels =
      await this.channelMemberRepository.getChannelsJoinCurrently(userId);
    const joinChannelsId = joinChannels.map((channel) => channel.channelId.id);
    const channelList = await this.channelRepository.getChannels(
      joinChannelsId,
    );
    const newChannelList: Array<ChannelInfoDto> = [];
    channelList.map((oldInfo: Channel) => {
      newChannelList.push(this.changeChannelInfo(oldInfo));
    });
    return newChannelList;
  }

  async makeChannel(
    userId: string,
    createChannelData: CreateChannelDto,
  ): Promise<SuccessOrFailDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    const regex = /[^???-???\w\s]/g;
    const trimName = createChannelData.channelName.trim();
    if (
      trimName.length === 0 ||
      regex.test(trimName) === true ||
      trimName.length > 20
    ) {
      throw new BadRequestException('????????? ??????');
    }

    const isExistChannel = await this.channelRepository.findChannelByName(
      createChannelData.channelName,
    );
    if (isExistChannel) {
      throw new BadRequestException('?????? ?????? ??????');
    }
    const user = await this.userRepository.findOneBy({ id: userId });

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let isSuccess = true;
    try {
      const channel = await this.channelRepository.makeChannel(
        createChannelData,
      );
      await this.channelMemberRepository.createChannelMember(
        user,
        channel,
        RoleInChannel.OWNER,
      );
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      isSuccess = false;
    } finally {
      await queryRunner.release();
      return { success: isSuccess };
    }
  }

  async deleteChannel(
    userId: string,
    channelId: string,
  ): Promise<SuccessOrFailDto> {
    const isExistChannel = await this.channelRepository.findOneBy({
      id: channelId,
    });
    const isJoinChannel =
      await this.channelMemberRepository.findChannelJoinAsAdmin(
        userId,
        channelId,
      );
    if (!isExistChannel || !isJoinChannel) {
      throw new BadRequestException('????????? ????????? ??? ????????????');
    }
    await this.channelRepository.update(channelId, {
      deletedAt: () => 'CURRENT_TIMESTAMP',
    });
    return { success: true };
  }

  async joinChannels(
    userId: string,
    channelId: string,
    channelPassword: ChannelPasswordDto,
  ): Promise<SuccessOrFailDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const channel = await this.channelRepository.findOneBy({ id: channelId });
    if (!channel) {
      throw new BadRequestException('???????????? ?????? ??????');
    }
    const joinChannels =
      await this.channelMemberRepository.findChannelHaveJoinOrInvite(
        userId,
        channelId,
      );
    if (joinChannels && joinChannels.banEndAt >= new Date()) {
      throw new BadRequestException('??????????????? ?????? ???????????????');
    }
    if (joinChannels && joinChannels.joinAt && !joinChannels.leftAt) {
      throw new BadRequestException('?????? ????????? ??????');
    }
    if (
      (joinChannels && !channel.isPublic && joinChannels.joinAt) ||
      (!joinChannels && !channel.isPublic)
    ) {
      throw new BadRequestException('?????? ????????? ????????????');
    }
    if (channel.password) {
      const passwordCompare = await bcrypt.compare(
        channelPassword.password,
        channel.password,
      );
      if (!passwordCompare) {
        throw new BadRequestException('??????????????? ???????????????');
      }
    }
    if (joinChannels) {
      await this.channelMemberRepository.update(joinChannels.id, {
        joinAt: () => 'CURRENT_TIMESTAMP',
        leftAt: null,
      });
      return { success: true };
    }
    await this.channelMemberRepository.createChannelMember(
      user,
      channel,
      RoleInChannel.NORMAL,
    );
    return { success: true };
  }

  async changeChannelOwner(channelId: string) {
    let ownerCandidates =
      await this.channelMemberRepository.getChannelAdministrators(channelId);
    if (ownerCandidates.length === 0) {
      ownerCandidates =
        await this.channelMemberRepository.getChannelMembersExcludeOwner(
          channelId,
        );
    }
    if (ownerCandidates.length === 0) {
      await this.channelRepository.update(channelId, {
        deletedAt: () => 'CURRENT_TIMESTAMP',
      });
      return null;
    }
    await this.channelMemberRepository.update(ownerCandidates[0].id, {
      roleInChannel: RoleInChannel.OWNER,
    });
    return ownerCandidates[0].id;
  }

  async getOutChannel(
    userId: string,
    channelId: string,
  ): Promise<SuccessOrFailDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    const channel = await this.channelRepository.findOneBy({ id: channelId });
    if (!channel) {
      throw new BadRequestException('?????? ????????? ?????????');
    }
    const joinChannels =
      await this.channelMemberRepository.findChannelJoinCurrently(
        userId,
        channelId,
      );
    if (!joinChannels) {
      throw new BadRequestException('???????????? ?????? ???????????????.');
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let isSuccess = true;
    try {
      await this.channelMemberRepository.update(joinChannels.id, {
        leftAt: () => 'CURRENT_TIMESTAMP',
        roleInChannel: RoleInChannel.NORMAL,
      });
      if (joinChannels.roleInChannel === RoleInChannel.OWNER) {
        await this.changeChannelOwner(channelId);
      }
      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
      isSuccess = false;
    } finally {
      await queryRunner.release();
      return { success: isSuccess };
    }
  }

  changeChannelMessageInfo(oldInfo: ChannelMessage) {
    const newInfo: ChannelMessageDto = new ChannelMessageDto();
    newInfo.id = oldInfo.id;
    newInfo.createdAt = oldInfo.createdAt;
    newInfo.message = oldInfo.message;
    newInfo.channelId = this.changeChannelInfo(oldInfo.channelId);
    newInfo.sendUserId = oldInfo.sendUserId;
    return newInfo;
  }

  async getChannelMessages(
    userId: string,
    channelId: string,
  ): Promise<ChannelMessageDto[]> {
    const channel = await this.channelRepository.findOneBy({ id: channelId });
    if (!channel) {
      throw new BadRequestException('?????? ????????? ?????????');
    }
    const joinChannel =
      await this.channelMemberRepository.findChannelJoinCurrently(
        userId,
        channelId,
      );
    if (!joinChannel) {
      throw new BadRequestException(
        '?????? ?????? ????????? ????????? ??? ??? ?????? ????????? ????????????',
      );
    }
    const blockUsers = await this.blockRepository.getBlockUsers(userId);
    const messages = await this.channelMessageRepository.getChannelMessages(
      channelId,
      blockUsers,
    );
    const newMessages: ChannelMessageDto[] = [];
    messages.map((message) => {
      newMessages.push(this.changeChannelMessageInfo(message));
    });
    return newMessages;
  }

  changeUserInfo(oldInfo: User) {
    const newInfo: UserInfoDto = new UserInfoDto();
    newInfo.id = oldInfo.id;
    newInfo.username = oldInfo.username;
    newInfo.profileImage = oldInfo.profileImage;
    newInfo.status = oldInfo.status;
    newInfo.ladder = oldInfo.ladder;
    return newInfo;
  }

  async findParticipants(userId: string, channelId: string) {
    const channel = await this.channelRepository.findChannelById(channelId);
    if (!channel) {
      throw new BadRequestException('?????? ????????? ?????? ????????? ?????????');
    }
    const channelMembersData =
      await this.channelMemberRepository.getChannelMembers(channelId);
    const channelMembers = channelMembersData.map((channel) => {
      return {
        ...this.changeUserInfo(channel.userId),
        userRoleInChannel: channel.roleInChannel,
        userMute: channel.muteEndAt < new Date() ? false : true,
      };
    });
    if (channel.isPublic) {
      return channelMembers;
    } else {
      const joinChannel =
        await this.channelMemberRepository.findChannelJoinCurrently(
          userId,
          channelId,
        );
      if (!joinChannel) {
        throw new BadRequestException('?????? ????????? ??? ??? ?????? ????????? ????????????');
      }
      return channelMembers;
    }
  }

  async findUserInChannl(userId: string, channelId: string) {
    const channel = await this.channelRepository.findChannelById(channelId);
    if (!channel) {
      throw new BadRequestException('?????? ????????? ?????????');
    }
    const channelUser =
      await this.channelMemberRepository.findChannelJoinCurrently(
        userId,
        channelId,
      );
    if (!channelUser) {
      throw new BadRequestException('?????? ????????? ????????? ??????');
    }
    const channelUserInfo = {
      ...this.changeUserInfo(channelUser.userId),
      userRoleInChannel: channelUser.roleInChannel,
      userMute: channelUser.muteEndAt < new Date() ? false : true,
    };
    return channelUserInfo;
  }

  async changePassword(
    userId: string,
    channelId: string,
    channelPassword: ChannelPasswordDto,
  ): Promise<SuccessOrFailDto> {
    const isExistChannel = await this.channelRepository.findOneBy({
      id: channelId,
    });
    const isJoinChannel =
      await this.channelMemberRepository.findChannelJoinAsAdmin(
        userId,
        channelId,
      );
    if (!isExistChannel || !isJoinChannel) {
      throw new BadRequestException(
        '??? ??? ?????? ??????????????? ????????? ?????? ????????? ????????????.',
      );
    }
    let hashPassword = null;
    if (channelPassword?.password) {
      hashPassword = await bcrypt.hash(channelPassword.password, 10);
    }
    await this.channelRepository.update(channelId, {
      password: hashPassword,
    });
    return { success: true };
  }

  async restirctByChannelAdmin(
    userId: string,
    channelId: string,
    targetId: string,
  ) {
    const isExistChannel = await this.channelRepository.findOneBy({
      id: channelId,
    });
    const adminUserInChannel =
      await this.channelMemberRepository.findChannelJoinAsAdmin(
        userId,
        channelId,
      );
    const targetIdJoinInChannel =
      await this.channelMemberRepository.findChannelJoinCurrently(
        targetId,
        channelId,
      );
    if (
      !isExistChannel ||
      !adminUserInChannel ||
      !targetIdJoinInChannel ||
      targetIdJoinInChannel?.roleInChannel === RoleInChannel.OWNER
    ) {
      throw new BadRequestException(
        '????????? ?????? ????????? ????????? ?????? ????????? ????????? ??? ????????????.',
      );
    }
    return targetIdJoinInChannel;
  }

  async restirctByChannelOwner(
    userId: string,
    channelId: string,
    targetId: string,
    changeRole: ChangeRoleInChannelDto,
  ) {
    const isExistChannel = await this.channelRepository.findOneBy({
      id: channelId,
    });
    const adminUserInChannel =
      await this.channelMemberRepository.findChannelJoinAsAdmin(
        userId,
        channelId,
      );
    const targetIdJoinInChannel =
      await this.channelMemberRepository.findChannelJoinCurrently(
        targetId,
        channelId,
      );
    if (
      !isExistChannel ||
      !adminUserInChannel ||
      !targetIdJoinInChannel ||
      targetIdJoinInChannel?.roleInChannel === RoleInChannel.OWNER ||
      changeRole.roleInChannel === RoleInChannel.OWNER
    ) {
      throw new BadRequestException(
        '????????? ?????? ????????? ????????? ?????? ????????? ????????? ??? ????????????.',
      );
    }
    return targetIdJoinInChannel;
  }

  async muteUser(
    userId: string,
    channelId: string,
    targetId: string,
    muteEndAt: Date,
  ): Promise<SuccessOrFailDto> {
    const target = await this.restirctByChannelAdmin(
      userId,
      channelId,
      targetId,
    );
    await this.channelMemberRepository.update(target.id, {
      muteEndAt: muteEndAt,
    });
    return { success: true };
  }

  async banUser(
    userId: string,
    channelId: string,
    targetId: string,
    banEndAt: Date,
  ): Promise<SuccessOrFailDto> {
    const target = await this.restirctByChannelAdmin(
      userId,
      channelId,
      targetId,
    );
    await this.channelMemberRepository.update(target.id, {
      banEndAt: banEndAt,
      leftAt: () => 'CURRENT_TIMESTAMP',
      roleInChannel: RoleInChannel.NORMAL,
    });

    return { success: true };
  }

  async changeRoleInChannel(
    userId: string,
    channelId: string,
    targetId: string,
    changeRole: ChangeRoleInChannelDto,
  ): Promise<SuccessOrFailDto> {
    const target = await this.restirctByChannelOwner(
      userId,
      channelId,
      targetId,
      changeRole,
    );
    await this.channelMemberRepository.update(target.id, {
      roleInChannel: changeRole.roleInChannel,
    });
    return { success: true };
  }

  async inviteUser(
    userId: string,
    channelId: string,
    targetId: string,
  ): Promise<SuccessOrFailDto> {
    const target = await this.userRepository.findOneBy({ id: targetId });
    const channel = await this.channelRepository.findOneBy({ id: channelId });
    const userInChannel =
      await this.channelMemberRepository.findChannelJoinCurrently(
        userId,
        channelId,
      );
    if (!target || !channel || !userInChannel) {
      throw new BadRequestException(
        '???????????? ?????? ??????????????? ???????????? ?????? ?????????',
      );
    }
    const joinChannels =
      await this.channelMemberRepository.findChannelHaveJoinOrInvite(
        targetId,
        channelId,
      );
    if (joinChannels && joinChannels.banEndAt >= new Date()) {
      throw new BadRequestException('??????????????? ?????? ???????????????');
    }
    if (joinChannels && (!joinChannels.leftAt || !joinChannels.joinAt)) {
      throw new BadRequestException(
        '?????? ???????????? ????????? ????????? ????????? ???????????????.',
      );
    }
    if (joinChannels) {
      await this.channelMemberRepository.update(joinChannels.id, {
        joinAt: null,
      });
      return { success: true };
    }
    await this.channelMemberRepository.inviteChannelMember(target, channel);
    return { success: true };
  }
}
