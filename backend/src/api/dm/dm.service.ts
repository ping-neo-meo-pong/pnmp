import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DmRoomRepository } from '../../core/dm/dm-room.repository';
import { DmRepository } from '../../core/dm/dm.repository';
import { CreateDmRoomDto } from '../../core/dm/dto/create-dm-room.dto';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { Dm } from '../../core/dm/dm.entity';
import { UserRepository } from '../../core/user/user.repository';
import { UserService } from '../../api/user/user.service';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmRoomRepository)
    private dmRoomRepository: DmRoomRepository,
    @InjectRepository(DmRepository)
    private dmRepository: DmRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private userService: UserService,
  ) {}

  /*
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
  */

  async createDmRoom(userId: string, invitedUserName: string): Promise<any> {
    const invitedUser = await this.userRepository.findOneBy({
      userName: invitedUserName
    });
    if (!invitedUser)
      throw new BadRequestException('invited user does not exist');
    if (userId === invitedUser.id) {
      throw new BadRequestException('cannot create DM room with yourself');
    }
    const dmRoom = await this.dmRoomRepository.findOne({
      relations: ['userId', 'invitedUserId'],
      where: [
        {
          userId: { id: userId },
          invitedUserId: { id: invitedUser.id },
        },
        {
          userId: { id: invitedUser.id },
          invitedUserId: { id: userId },
        },
      ],
    });

    if (dmRoom) {
      throw new BadRequestException('DM room already exists');
    } else {
      await this.dmRoomRepository.save({
        userId: userId,
        invitedUserId: invitedUser.id,
      } as any);
      const createdDmRoom = await this.dmRoomRepository.findOneBy({
        userId: { id: userId },
        invitedUserId: { id: invitedUser.id },
      });
      this.userService.getSocket(userId)?.join(createdDmRoom.id);
      this.userService.getSocket(invitedUser.id)?.join(createdDmRoom.id);
      return {
        id: createdDmRoom.id,
        otherUser: createdDmRoom.userId.id === userId ?
          createdDmRoom.invitedUserId.userName :
          createdDmRoom.userId.userName,
      };
    }
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
