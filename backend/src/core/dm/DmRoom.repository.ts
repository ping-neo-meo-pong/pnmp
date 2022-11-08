import { EntityRepository, Repository } from 'typeorm';
import { DmRoom } from './DmRoom.entity';

@EntityRepository(DmRoom)
export class DmRoomRepository extends Repository<DmRoom> {}
