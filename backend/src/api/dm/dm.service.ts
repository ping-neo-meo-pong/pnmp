import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DmRoomRepository } from '../../core/dm/dm-room.repository';
import { DmRepository } from '../../core/dm/dm.repository';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { Dm } from '../../core/dm/dm.entity';
import { UserRepository } from '../../core/user/user.repository';
import { BlockRepository } from '../../core/block/block.repository';
import { SuccessOrFailDto } from '../dto/success-or-fail.dto';

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

  async getDmRoomsByParticipant(userId: string): Promise<DmRoom[]> {
    return await this.dmRoomRepository.getDmRoomsByParticipant(userId);
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

  async createDmRoom(
    userId: string,
    invitedUserId: string,
  ): Promise<SuccessOrFailDto> {
    const invitedUser = await this.userRepository.findOneBy({
      id: invitedUserId,
    });
    if (!invitedUser || userId === invitedUserId) {
      throw new BadRequestException('초대할 수 없는 상대 입니다');
    }
    const dmRoom = await this.dmRoomRepository.findByParticipants(
      userId,
      invitedUserId,
    );
    if (dmRoom) {
      throw new BadRequestException('이미 존재하는 방입니다.');
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    await this.dmRoomRepository.createDmRoom(user, invitedUser);
    return { success: true };
  }
}
