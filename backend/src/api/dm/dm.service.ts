import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DmRoomRepository } from '../../core/dm/dm-room.repository';
import { DmRepository } from '../../core/dm/dm.repository';
import { CreateDmRoomDto } from '../../core/dm/dto/create-dm-room.dto';
import { CreateDmDto } from '../../core/dm/dto/create-dm.dto';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { Dm } from '../../core/dm/dm.entity';
import { UserRepository } from '../../core/user/user.repository';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmRoomRepository)
    private dmRoomRepository: DmRoomRepository,
    @InjectRepository(DmRepository)
    private dmRepository: DmRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createDmRoom(userToken, dmRoomData: CreateDmRoomDto): Promise<DmRoom> {
    // userId와 invitedUserId가 같으면 예외처리
    if (userToken.id === String(dmRoomData.invitedUserId)) {
      throw new BadRequestException('userId === invitedUserId');
    }
    // 같은 참여자들이 있는 DM 방이 이미 있으면 예외처리
    const [dmRooms, count] =
      await this.dmRoomRepository.findAndCountByParticipants(
        userToken,
        dmRoomData,
      );
    if (count > 0) {
      return dmRooms[0];
    }
    // 예외에 걸리지 걸리지 않으면 생성하고, 참여자가 join 된 결과를 반환
    dmRoomData.userId = await this.userRepository.findOneBy({
      id: userToken.id,
    });
    const createDmRoom = await this.dmRoomRepository.createDmRoom(dmRoomData);
    return await this.dmRoomRepository.findOneBy({ id: createDmRoom.id });
  }

  async getDmRooms(userToken): Promise<any[]> {
    const dmRooms = await this.dmRoomRepository.getDmRooms(userToken);
    let result = [];
    for (let dmRoom of dmRooms) {
      result.push({
        id: dmRoom.id,
        otherUser: dmRoom.userId.id === userToken.id ?
          dmRoom.invitedUserId.userName : dmRoom.userId.userName,
      });
    }
    return result;
  }

  async createDm(dmData: any) {
    this.dmRepository.save(dmData);
  }

  async getDms(roomId: any): Promise<Dm[]> {
    return await this.dmRepository.find({
      where: {
        dmRoomId: {
          id: roomId,
        }
      },
    });
  }
}
