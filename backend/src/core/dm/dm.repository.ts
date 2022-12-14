import { Repository, LessThan } from 'typeorm';
import { Dm } from './dm.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(Dm)
export class DmRepository extends Repository<Dm> {
  async getDms(
    roomId: string,
    userId: string,
    otherId: string,
    blockAt: Date | null,
  ) {
    if (blockAt) {
      return await this.find({
        relations: ['dmRoomId', 'sendUserId'],
        order: {
          createdAt: 'ASC',
        },
        where: [
          {
            dmRoomId: {
              id: roomId,
            },
            sendUserId: {
              id: otherId,
            },
            createdAt: LessThan(blockAt),
          },
          {
            dmRoomId: {
              id: roomId,
            },
            sendUserId: {
              id: userId,
            },
          },
        ],
      });
    }
    return await this.find({
      relations: ['dmRoomId', 'sendUserId'],
      order: {
        createdAt: 'ASC',
      },
      where: {
        dmRoomId: {
          id: roomId,
        },
      },
    });
  }
}
