import { Repository } from 'typeorm';
import { GameRoom } from './game-room.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { CreateGameRoomDto } from './dto/create-game-room.dto';

@CustomRepository(GameRoom)
export class GameRoomRepository extends Repository<GameRoom> {
  async createGameRoom(gameRoomData: CreateGameRoomDto): Promise<GameRoom> {
    const gameRoom = this.create(gameRoomData);
    await this.save(gameRoom);
    return gameRoom;
  }

  async getGameRooms(userToken): Promise<GameRoom[]> {
    const gameRooms = await this.find({
      relations: ['leftUserId', 'rightUserId']
    });
    return gameRooms;
  }
}
