import { Repository } from 'typeorm';
import { DmRoom } from './dm-room.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { CreateDmRoomDto } from './dto/create-dm-room.dto';

@CustomRepository(DmRoom)
export class DmRoomRepository extends Repository<DmRoom> {
  async createDmRoom(dmRoomData: CreateDmRoomDto): Promise<DmRoom> {
    const dmRoom = this.create(dmRoomData);
    await this.save(dmRoom);
    return dmRoom;
  }

  async getDmRooms(userToken): Promise<DmRoom[]> {
    console.log(userToken);
    const [dmRooms, count] = await this.findAndCount({
      relations: ['userId', 'invitedUserId'],
      where: [
        { userId: { id: userToken.id } },
        { invitedUserId: { id: userToken.id } },
      ],
    });
    return dmRooms;
  }

  async findAndCountByParticipants(
    userToken,
    dmRoomData: CreateDmRoomDto,
  ): Promise<[DmRoom[], number]> {
    const [dmRooms, count] = await this.findAndCount({
      relations: ['userId', 'invitedUserId'],
      where: [
        {
          userId: { id: String(userToken.id) },
          invitedUserId: { id: String(dmRoomData.invitedUserId) },
        },
        {
          userId: { id: String(dmRoomData.invitedUserId) },
          invitedUserId: { id: String(userToken.id) },
        },
      ],
    });
    return [dmRooms, count];
  }
}
