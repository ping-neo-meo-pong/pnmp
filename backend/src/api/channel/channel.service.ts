import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelRepository } from '../../core/channel/channel.repository';
import { ChannelMemberRepository } from '../../core/channel/channel-member.repository';
import { Channel } from '../../core/channel/channel.entity';
import { IsNull } from 'typeorm';
import { ChannelMember } from '../../core/channel/channel-member.entity';
import { User } from '../../core/user/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UserRepository } from '../../core/user/user.repository';
import { ChannelPasswordDto } from './dto/channel-password.dto';
import { RoleInChannel } from 'src/enum/role-in-channel.enum';
import { ChangeRoleInChannelDto } from './dto/change-role-in-channel.dto';
import { BlockRepository } from '../../core/block/block.repository';
import { ChannelMessageRepository } from '../../core/channel/channel-message.repository';

@Injectable()
export class ChannelService {
  constructor(
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

  async getChannels(userId: string): Promise<Channel[]> {
    const joinChannels =
      await this.channelMemberRepository.getChannelsJoinCurrently(userId);
    const joinChannelsId = joinChannels.map((channel) => channel.channelId.id);
    return await this.channelRepository.getChannels(joinChannelsId);
  }

  async makeChannel(userId: string, createChannelData: CreateChannelDto) {
    const isExistChannel = await this.channelRepository.findOne({
      where: {
        channelName: createChannelData.channelName,
        deletedAt: IsNull(),
      },
    });
    if (isExistChannel) {
      throw new BadRequestException('채널 이름 중복');
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    const channel = await this.channelRepository.makeChannel(createChannelData);
    await this.channelMemberRepository.createChannelMember(user, channel);
    return channel;
  }

  async deleteChannel(userId: string, channelId: string) {
    const isExistChannel = await this.channelRepository.findOneBy({
      id: channelId,
    });
    const isJoinChannel =
      await this.channelMemberRepository.findChannelJoinAsAdmin(
        userId,
        channelId,
      );
    if (!isExistChannel || !isJoinChannel) {
      throw new BadRequestException('채널을 삭제할 수 없습니다');
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
  ): Promise<Channel | ChannelMember> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const channel = await this.channelRepository.findOneBy({ id: channelId });
    if (!channel) {
      throw new BadRequestException('존재하지 않는 채널');
    }
    const joinChannels =
      await this.channelMemberRepository.findChannelHaveJoinOrInvite(
        userId,
        channelId,
      );
    if (joinChannels && joinChannels.banEndAt >= new Date()) {
      throw new BadRequestException('채널로부터 차단 당했습니다');
    }
    if (joinChannels && joinChannels.joinAt && !joinChannels.leftAt) {
      throw new BadRequestException('이미 참여한 채널');
    }
    if (
      (joinChannels && !channel.isPublic && joinChannels.joinAt) ||
      (!joinChannels && !channel.isPublic)
    ) {
      throw new BadRequestException('입장 권한이 없습니다');
    }
    // 비밀번호 암호화 검증 추가
    if (channel.password && channel.password !== channelPassword.password) {
      throw new BadRequestException('비밀번호가 틀렸습니다');
    }
    if (joinChannels) {
      await this.channelMemberRepository.update(joinChannels.id, {
        joinAt: () => 'CURRENT_TIMESTAMP',
        leftAt: null,
      });
      return joinChannels;
    }
    const channelMember = this.channelMemberRepository.create({
      userId: user,
      channelId: channel,
    });
    await this.channelMemberRepository.save(channelMember);
    return channelMember;
  }

  async changeChannelOwner(channelId: string) {
    let ownerCandidates =
      await this.channelMemberRepository.getChannelAdministrators(channelId);
    if (ownerCandidates.length == 0) {
      ownerCandidates =
        await this.channelMemberRepository.getChannelMembersExcludeOwner(
          channelId,
        );
    }
    if (ownerCandidates.length == 0) {
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
  ): Promise<Channel | ChannelMember> {
    // const user = await this.channelRepository.findOneBy({ id: channelId });
    const channel = await this.channelRepository.findOneBy({ id: channelId });
    if (!channel) {
      throw new BadRequestException('채널 정보가 잘못됨');
    }
    const joinChannels =
      await this.channelMemberRepository.findChannelJoinCurrently(
        userId,
        channelId,
      );
    if (!joinChannels) {
      throw new BadRequestException('들어가지 않은 채널입니다.');
    }
    await this.channelMemberRepository.update(joinChannels.id, {
      leftAt: () => 'CURRENT_TIMESTAMP',
      roleInChannel: RoleInChannel.NORMAL,
    });
    if (joinChannels.roleInChannel === RoleInChannel.OWNER) {
      await this.changeChannelOwner(channelId);
    }
    return await this.channelRepository.findOneBy({ id: channelId });
  }

  async getChannelMessages(userId: string, channelId: string) {
    const channel = await this.channelRepository.findOneBy({ id: channelId });
    if (!channel) {
      throw new BadRequestException('채널 정보가 잘못됨');
    }
    const joinChannel =
      await this.channelMemberRepository.findChannelJoinCurrently(
        userId,
        channelId,
      );
    if (!joinChannel) {
      throw new BadRequestException(
        '해당 채널 메세지 목록을 볼 수 있는 권한이 없습니다',
      );
    }
    const blockUsers = await this.blockRepository.getBlockUsers(userId);
    return await this.channelMessageRepository.getChannelMessages(
      userId,
      channelId,
      blockUsers,
    );
  }

  async findParticipants(userId: string, channelId: string): Promise<User[]> {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId, deletedAt: IsNull() },
    });
    if (!channel) {
      throw new BadRequestException('유저 정보나 채널 정보가 잘못됨');
    }
    const channelMembersData =
      await this.channelMemberRepository.getChannelMembers(channelId);
    const channelMembers = channelMembersData.map((channel) => {
      return {
        ...channel.userId,
        userRoleInChannel: channel.roleInChannel,
        userBan: channel.banEndAt < new Date() ? false : true,
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
        throw new BadRequestException('채널 멤버를 볼 수 있는 권한이 없습니다');
      }
      return channelMembers;
    }
  }

  async changePassword(
    userId: string,
    channelId: string,
    channelPassword: ChannelPasswordDto,
  ) {
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
        '알 수 없는 채널이거나 채널에 대한 권한이 없습니다.',
      );
    }
    // 비밀번호 암호화
    await this.channelRepository.update(channelId, {
      password: channelPassword?.password ? channelPassword?.password : null,
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
        '채널에 대한 권한이 없거나 해당 유저를 차단할 수 없습니다.',
      );
    }
    return targetIdJoinInChannel;
  }

  async restirctByWebSiteAdmin(
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
    if (!isExistChannel || !targetIdJoinInChannel) {
      throw new BadRequestException(
        '채널에 대한 권한이 없거나 해당 유저를 차단할 수 없습니다.',
      );
    }

    // channel admin
    if (
      !adminUserInChannel ||
      targetIdJoinInChannel.roleInChannel === RoleInChannel.OWNER ||
      changeRole.roleInChannel === RoleInChannel.OWNER
    ) {
      throw new BadRequestException(
        '채널에 대한 권한이 없거나 해당 유저를 차단할 수 없습니다.',
      );
    }
    return targetIdJoinInChannel;
  }

  async muteUser(
    userId: string,
    channelId: string,
    targetId: string,
    muteEndAt: Date,
  ) {
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
  ) {
    const target = await this.restirctByChannelAdmin(
      userId,
      channelId,
      targetId,
    );
    await this.channelMemberRepository.update(target.id, {
      banEndAt: banEndAt,
      leftAt: () => 'CURRENT_TIMESTAMP',
    });
    return { success: true };
  }

  //   async blockUserFromChannel(
  //     userId: string,
  //     channelId: string,
  //     targetId: string,
  //   ) {
  //     const target = await this.restirctByChannelAdmin(
  //       userId,
  //       channelId,
  //       targetId,
  //     );
  //     await this.channelMemberRepository.update(target.id, {
  //       leftAt: () => 'CURRENT_TIMESTAMP',
  //       roleInChannel: RoleInChannel.BLOCK,
  //     });
  //     return { success: true };
  //   }

  async changeRoleInChannel(
    userId: string,
    channelId: string,
    targetId: string,
    changeRole: ChangeRoleInChannelDto,
  ) {
    const target = await this.restirctByWebSiteAdmin(
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

  async inviteUser(userId: string, channelId: string, targetId: string) {
    const target = await this.userRepository.findOneBy({ id: targetId });
    const channel = await this.channelRepository.findOneBy({ id: channelId });
    const userInChannel =
      await this.channelMemberRepository.findChannelJoinCurrently(
        userId,
        channelId,
      );
    if (!target || !channel || !userInChannel) {
      throw new BadRequestException(
        '존재하지 않는 채널이거나 존재하지 않는 사용자',
      );
    }
    const joinChannels =
      await this.channelMemberRepository.findChannelHaveJoinOrInvite(
        targetId,
        channelId,
      );
    if (joinChannels && joinChannels.banEndAt >= new Date()) {
      throw new BadRequestException('채널로부터 차단 당했습니다');
    }
    if (joinChannels && (!joinChannels.leftAt || !joinChannels.joinAt)) {
      throw new BadRequestException(
        '이미 사용자가 채널에 있거나 초대된 상태입니다.',
      );
    }
    if (joinChannels) {
      await this.channelMemberRepository.update(joinChannels.id, {
        joinAt: null,
      });
      return joinChannels;
    }
    const channelMember = this.channelMemberRepository.create({
      userId: target,
      channelId: channel,
      joinAt: null,
    });
    await this.channelMemberRepository.save(channelMember);
    return channelMember;
  }
}
