import { Repository, IsNull, Not, In } from 'typeorm';
import { Channel } from './channel.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { CreateChannelDto } from '../../api/channel/dto/create-channel.dto';
import * as bcrypt from 'bcrypt';

@CustomRepository(Channel)
export class ChannelRepository extends Repository<Channel> {
  async getChannels(joinChannelsId) {
    if (joinChannelsId.length > 0) {
      return await this.find({
        where: {
          id: Not(In(joinChannelsId)),
          isPublic: true,
          deletedAt: IsNull(),
        },
      });
    }
    return await this.find({
      where: {
        isPublic: true,
        deletedAt: IsNull(),
      },
    });
  }

  async makeChannel(createChannelData: CreateChannelDto) {
    let hashPassword = null;
    if (createChannelData?.password) {
      hashPassword = await bcrypt.hash(createChannelData.password, 10);
    }
    createChannelData.password = hashPassword;
    return await this.save(createChannelData.toChannelEntity());
  }

  async findChannelByName(channelName: string) {
    return await this.findOne({
      where: {
        channelName: channelName,
        deletedAt: IsNull(),
      },
    });
  }

  async findChannelById(channelId: string) {
    return await this.findOne({
      where: { id: channelId, deletedAt: IsNull() },
    });
  }
}
