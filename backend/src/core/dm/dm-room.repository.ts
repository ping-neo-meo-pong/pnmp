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

  async getDmRooms(): Promise<DmRoom[]> {
    return this.find();
  }

  async findAndCountByParticipants(
    dmRoomData: CreateDmRoomDto,
  ): Promise<[DmRoom[], number]> {
    const [dmRooms, count] = await this.findAndCount({
      relations: ['userId', 'invitedUserId'],
      where: [
        {
          userId: { id: String(dmRoomData.userId) },
          invitedUserId: { id: String(dmRoomData.invitedUserId) },
        },
        {
          userId: { id: String(dmRoomData.invitedUserId) },
          invitedUserId: { id: String(dmRoomData.userId) },
        },
      ],
    });
    return [dmRooms, count];
  }
}
