import { Repository } from 'typeorm';
import { DmRoom } from './dm-room.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(DmRoom)
export class DmRoomRepository extends Repository<DmRoom> {}
