import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DmRoomRepository } from '../../core/dm/dm-room.repository';
import { DmRepository } from '../../core/dm/dm.repository';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { Dm } from '../../core/dm/dm.entity';
import { UserRepository } from '../../core/user/user.repository';
import { SocketRepository } from '../../core/socket/socket.repository';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmRoomRepository)
    private dmRoomRepository: DmRoomRepository,
    @InjectRepository(DmRepository)
    private dmRepository: DmRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private socketRepository: SocketRepository,
  ) {}

  /*
  async createDmRoom(userId: string, invitedUserId: string): Promise<DmRoom> {
    const invitedUser = await this.userRepository.findOneBy({
      id: invitedUserId,
    });
    if (!invitedUser)
      throw new BadRequestException('invited user does not exist');
    if (userId === invitedUserId) {
      throw new BadRequestException('userId === invitedUserId');
    }
    // 같은 참여자들이 있는 DM 방이 이미 있으면 예외처리
    const dmRoom = await this.dmRoomRepository.findAndCountByParticipants(
      userId,
      invitedUserId,
    );
    if (dmRoom) {
      return dmRoom;
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    return await this.dmRoomRepository.createDmRoom(user, invitedUser);
  }
  */

  async createDmRoom(userId: string, invitedUserName: string): Promise<any> {
    const invitedUser = await this.userRepository.findOneBy({
      username: invitedUserName,
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
      console.log(`dmRoom:`);
      console.log(createdDmRoom);
      this.socketRepository.find(userId)?.join(createdDmRoom.id);
      this.socketRepository.find(invitedUser.id)?.join(createdDmRoom.id);
      return {
        id: createdDmRoom.id,
        otherUser:
          createdDmRoom.userId.id === userId
            ? createdDmRoom.invitedUserId.username
            : createdDmRoom.userId.username,
      };
    }
  }

  async getDmRooms(userToken): Promise<DmRoom[]> {
    const dmRooms = await this.dmRoomRepository.getDmRooms(userToken);
    const result = [];
    for (const dmRoom of dmRooms) {
      result.push({
        id: dmRoom.id,
        otherUser:
          dmRoom.userId.id === userToken.id
            ? dmRoom.invitedUserId.username
            : dmRoom.userId.username,
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
        },
      },
    });
  }
}
