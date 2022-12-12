import { Repository, IsNull, LessThan, Not } from 'typeorm';
import { ChannelMember } from './channel-member.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { User } from '../user/user.entity';
import { Channel } from './channel.entity';
import { RoleInChannel } from '../../enum/role-in-channel.enum';

@CustomRepository(ChannelMember)
export class ChannelMemberRepository extends Repository<ChannelMember> {
  async getChannelsJoinCurrently(userId: string) {
    return await this.find({
      relations: ['userId', 'channelId'],
      where: {
        userId: { id: userId },
        joinAt: Not(IsNull()),
        leftAt: IsNull(),
        channelId: { deletedAt: IsNull() },
      },
    });
  }

  async findChannelJoinCurrently(userId: string, channelId: string) {
    return await this.findOne({
      relations: ['userId', 'channelId'],
      where: {
        userId: { id: userId },
        joinAt: Not(IsNull()),
        leftAt: IsNull(),
        channelId: { id: channelId, deletedAt: IsNull() },
      },
    });
  }

  async findChannelJoinAsAdmin(userId: string, channelId: string) {
    return await this.findOne({
      relations: ['userId', 'channelId'],
      where: {
        userId: { id: userId },
        joinAt: Not(IsNull()),
        leftAt: IsNull(),
        banEndAt: IsNull() || LessThan(new Date()),
        roleInChannel: RoleInChannel.OWNER || RoleInChannel.ADMINISTRATOR,
        channelId: { id: channelId, deletedAt: IsNull() },
      },
    });
  }

  async findChannelHaveJoinOrInvite(userId: string, channelId: string) {
    return await this.findOne({
      relations: ['userId', 'channelId'],
      where: {
        userId: { id: userId },
        channelId: { id: channelId, deletedAt: IsNull() },
      },
    });
  }

  async getChannelAdministrators(channelId: string) {
    return await this.find({
      relations: ['userId', 'channelId'],
      order: {
        createdAt: 'ASC',
      },
      where: {
        leftAt: IsNull(),
        joinAt: Not(IsNull()),
        banEndAt: IsNull() || LessThan(new Date()),
        roleInChannel: RoleInChannel.ADMINISTRATOR,
        channelId: { id: channelId, deletedAt: IsNull() },
      },
    });
  }

  async getChannelMembersExcludeOwner(channelId: string) {
    return await this.find({
      relations: ['userId', 'channelId'],
      order: {
        createdAt: 'ASC',
      },
      where: {
        leftAt: IsNull(),
        joinAt: Not(IsNull()),
        banEndAt: IsNull() || LessThan(new Date()),
        roleInChannel: Not(RoleInChannel.OWNER),
        channelId: { id: channelId, deletedAt: IsNull() },
      },
    });
  }

  async getChannelMembers(channelId: string) {
    return await this.find({
      relations: ['userId', 'channelId'],
      where: {
        leftAt: IsNull(),
        joinAt: Not(IsNull()),
        channelId: { id: channelId },
      },
    });
  }

  async createChannelMember(user: User, channel: Channel) {
    const channelMember = this.create({
      userId: user,
      channelId: channel,
      roleInChannel: RoleInChannel.OWNER,
    });
    await this.save(channelMember);
    return channelMember;
  }
}
