import { EntityRepository, Repository } from 'typeorm';
import { GameRoom } from './GameRoom.entity';

@EntityRepository(GameRoom)
export class GameRoomRepository extends Repository<GameRoom> {}
