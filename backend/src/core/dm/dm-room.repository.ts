import { Repository } from 'typeorm';
import { DmRoom } from './dm-room.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { CreateDmRoomDto } from './dto/create-dm-room.dto';
import { UserTokenDto } from '../user/dto/user-token.dto';

@CustomRepository(DmRoom)
export class DmRoomRepository extends Repository<DmRoom> {
  async createDmRoom(dmRoomData: CreateDmRoomDto): Promise<DmRoom> {
    const dmRoom = this.create(dmRoomData);
    await this.save(dmRoom);
    return dmRoom;
  }

  async getDmRooms(userToken: UserTokenDto): Promise<DmRoom[]> {
    const [dmRooms, count] = await this.findAndCount({
      relations: ['userId', 'invitedUserId'],
      where: [
        { userId: { id: userToken.userId } },
        { invitedUserId: { id: userToken.userId } },
      ],
    });
    return dmRooms;
  }

  async findAndCountByParticipants(
    userToken: UserTokenDto,
    dmRoomData: CreateDmRoomDto,
  ): Promise<[DmRoom[], number]> {
    const [dmRooms, count] = await this.findAndCount({
      relations: ['userId', 'invitedUserId'],
      where: [
        {
          userId: { id: String(userToken.userId) },
          invitedUserId: { id: String(dmRoomData.invitedUserId) },
        },
        {
          userId: { id: String(dmRoomData.invitedUserId) },
          invitedUserId: { id: String(userToken.userId) },
        },
      ],
    });
    return [dmRooms, count];
  }
}
