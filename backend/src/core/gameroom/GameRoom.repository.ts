import { Repository } from 'typeorm';
import { GameRoom } from './GameRoom.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(GameRoom)
export class GameRoomRepository extends Repository<GameRoom> {
  async createGame(): Promise<GameRoom> {
    const game = this.create({ gameMode: 'hi' });

    await this.save(game);
    return game;
  }

  async getGames(): Promise<GameRoom[]> {
    return this.find();
  }
}
