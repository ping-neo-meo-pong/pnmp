import { Repository, In, Not } from 'typeorm';
import { ChannelMessage } from './channel-message.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(ChannelMessage)
export class ChannelMessageRepository extends Repository<ChannelMessage> {
  async getChannelMessages(
    userId: string,
    channelId: string,
    blockUsers: any[],
  ) {
    if (blockUsers.length > 0) {
      const blockUserIds: string[] = blockUsers.map(
        (blockUser) => blockUser.blockedUserId.id,
      );
      return await this.find({
        relations: ['channelId', 'sendUserId'],
        order: {
          createdAt: 'ASC',
        },
        where: {
          channelId: {
            id: channelId,
          },
          sendUserId: {
            id: Not(In(blockUserIds)),
          },
        },
      });
    }
    return await this.find({
      relations: ['channelId', 'sendUserId'],
      order: {
        createdAt: 'ASC',
      },
      where: {
        channelId: {
          id: channelId,
        },
      },
    });
  }
}
