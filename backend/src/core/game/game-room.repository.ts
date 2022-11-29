import { Repository } from 'typeorm';
import { GameRoom } from './game-room.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { CreateGameRoomDto } from '../../api/game/dto/create-game-room.dto';

@CustomRepository(GameRoom)
export class GameRoomRepository extends Repository<GameRoom> {
  async createGameRoom(gameRoomData: CreateGameRoomDto): Promise<GameRoom> {
    const gameRoom = this.create(gameRoomData);
    await this.save(gameRoom);
    return gameRoom;
  }

  async getGameRooms(userToken): Promise<GameRoom[]> {
    const gameRooms = await this.find({
      relations: ['leftUserId', 'rightUserId'],
    });
    return gameRooms;
  }

  async getGameRoomOne(userId): Promise<GameRoom> {
    console.log(userId);
    const gameRoom_left = await this.findOneBy({
      leftUserId: { id: userId },
    });
    console.log(`hi~2`);
    if (gameRoom_left) return gameRoom_left;
    console.log(`hi~3`);

    const gameRoom_right = await this.findOneBy({
      rightUserId: { id: userId },
    });
    return gameRoom_right;
  }
}
