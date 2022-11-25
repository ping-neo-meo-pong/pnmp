import { Repository } from 'typeorm';
import { DmRoom } from './dm-room.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { User } from '../user/user.entity';

@CustomRepository(DmRoom)
export class DmRoomRepository extends Repository<DmRoom> {
  async createDmRoom(user: User, invitedUser: User): Promise<DmRoom> {
    const dmRoom = this.create({
      userId: user,
      invitedUserId: invitedUser,
    });
    await this.save(dmRoom);
    return dmRoom;
  }

  async getDmRooms(userToken): Promise<DmRoom[]> {
    const dmRooms = await this.find({
      relations: ['userId', 'invitedUserId'],
      where: [
        { userId: { id: userToken.id } },
        { invitedUserId: { id: userToken.id } },
      ],
    });
    return dmRooms;
  }

  async findAndCountByParticipants(
    userId: string,
    invitedUserId: string,
  ): Promise<DmRoom> {
    const dmRoom = await this.findOne({
      relations: ['userId', 'invitedUserId'],
      where: [
        {
          userId: { id: userId },
          invitedUserId: { id: invitedUserId },
        },
        {
          userId: { id: invitedUserId },
          invitedUserId: { id: userId },
        },
      ],
    });
    return dmRoom;
  }
}
