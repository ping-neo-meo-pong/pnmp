import { IsString, IsOptional } from 'class-validator';
import { User } from '../../user/user.entity';
import { DmRoom } from '../dm-room.entity';

export class CreateDmDto {
  message: string;
  dmRoomId: DmRoom;
  sendUserId: User;
}
