import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DmRoomRepository } from '../../core/dm/dm-room.repository';
import { DmRepository } from '../../core/dm/dm.repository';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { Dm } from '../../core/dm/dm.entity';
import { UserRepository } from '../../core/user/user.repository';
import { BlockRepository } from '../../core/block/block.repository';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmRoomRepository)
    private dmRoomRepository: DmRoomRepository,
    @InjectRepository(DmRepository)
    private dmRepository: DmRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(BlockRepository)
    private blockRepository: BlockRepository,
  ) {}

  async createDmRoom(userId: string, invitedUserId: string) {
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
    const newDmRoom = await this.dmRoomRepository.createDmRoom(
      user,
      invitedUser,
    );
    return {
      id: newDmRoom.id,
      otherUser:
        newDmRoom.userId.id === userId
          ? newDmRoom.invitedUserId.username
          : newDmRoom.userId.username,
    };
  }

  /*
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
  */

  async getDmRoomsByParticipant(userId: string): Promise<DmRoom[]> {
    const dmRooms = await this.dmRoomRepository.getDmRoomsByParticipant(userId);
    const result = [];
    for (const dmRoom of dmRooms) {
      result.push({
        id: dmRoom.id,
        otherUser:
          dmRoom.userId.id === userId
            ? dmRoom.invitedUserId.username
            : dmRoom.userId.username,
      });
    }
    return result;
  }

  async createDm(dmData: any) {
    this.dmRepository.save(dmData);
  }

  async getDms(roomId: string, userId: string): Promise<Dm[]> {
    const dmRoom = await this.dmRoomRepository.getDmRoomByRoomId(roomId);
    if (!dmRoom) {
      throw new BadRequestException('bad request');
    }
    if (!(dmRoom.userId.id === userId || dmRoom.invitedUserId.id === userId)) {
      throw new BadRequestException(
        '해당 dm 목록을 볼 수 있는 권한이 없습니다',
      );
    }
    const otherId =
      userId === dmRoom.userId.id ? dmRoom.invitedUserId.id : dmRoom.userId.id;
    const isBlockUser = await this.blockRepository.didUserBlockOther(
      userId,
      otherId,
    );
    return await this.dmRepository.getDms(
      roomId,
      userId,
      otherId,
      isBlockUser?.blockAt ?? null,
    );
  }
}
