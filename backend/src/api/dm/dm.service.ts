import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DmRoomRepository } from '../../core/dm/dm-room.repository';
import { CreateDmRoomDto } from '../../core/dm/dto/create-dm-room.dto';
import { DmRoom } from '../../core/dm/dm-room.entity';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmRoomRepository)
    private dmRoomRepository: DmRoomRepository,
  ) {}

  async createDmRoom(dmRoomData: CreateDmRoomDto): Promise<DmRoom> {
    // userId와 invitedUserId가 같으면 예외처리
    if (dmRoomData.userId === dmRoomData.invitedUserId) {
      throw new BadRequestException('userId === invitedUserId');
    }
    // 같은 참여자들이 있는 DM 방이 이미 있으면 예외처리
    const [dmRooms, count] =
      await this.dmRoomRepository.findAndCountByParticipants(dmRoomData);
    if (count > 0) {
      return dmRooms[0];
    }
    // 예외에 걸리지 걸리지 않으면 생성하고, 참여자가 join 된 결과를 반환
    const createDmRoom = await this.dmRoomRepository.createDmRoom(dmRoomData);
    return await this.dmRoomRepository.findOneBy({ id: createDmRoom.id });
  }

  getDmRooms(): Promise<DmRoom[]> {
    return this.dmRoomRepository.getDmRooms();
  }
}
