import { Repository, IsNull, LessThan } from 'typeorm';
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
        leftAt: IsNull(),
        banEndAt: IsNull() || LessThan(new Date()),
        roleInChannel: RoleInChannel.OWNER || RoleInChannel.ADMINISTRATOR,
        channelId: { id: channelId, deletedAt: IsNull() },
      },
    });
  }

  async findChannelHaveJoin(userId: string, channelId: string) {
    return await this.findOne({
      relations: ['userId', 'channelId'],
      where: {
        userId: { id: userId },
        channelId: { id: channelId, deletedAt: IsNull() },
      },
    });
  }

  async getChannelMembers(channelId: string) {
    return await this.find({
      relations: ['userId', 'channelId'],
      where: {
        leftAt: IsNull(),
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
