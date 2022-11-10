import { Repository } from 'typeorm';
import { GameRoom } from './game-room.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(GameRoom)
export class GameRoomRepository extends Repository<GameRoom> {}
