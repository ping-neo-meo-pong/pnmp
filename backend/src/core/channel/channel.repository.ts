import { Repository, IsNull, Not, In } from 'typeorm';
import { Channel } from './channel.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { CreateChannelDto } from '../../api/channel/dto/create-channel.dto';

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
    // 비밀번호 암호화 과정 추가
    return await this.save(createChannelData.toChannelEntity());
  }
}
