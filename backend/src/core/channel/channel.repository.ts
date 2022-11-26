import { Repository, IsNull } from 'typeorm';
import { Channel } from './channel.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { CreateChannelDto } from '../../api/channel/dto/create-channel.dto';

@CustomRepository(Channel)
export class ChannelRepository extends Repository<Channel> {
  async getChannels(joinChannelsId) {
    return await this.createQueryBuilder('channel')
      .where(
        'channel.id NOT IN (:...ids) and channel.is_public = :isPublic and channel.deleted_at IS NULL',
        {
          ids: joinChannelsId,
          isPublic: true,
        },
      )
      .getMany();
  }

  async makeChannel(createChannelData: CreateChannelDto) {
    // 비밀번호 암호화 과정 추가
    return await this.save(createChannelData.toChannelEntity());
  }
}
