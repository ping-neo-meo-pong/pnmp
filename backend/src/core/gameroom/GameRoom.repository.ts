import { Repository } from 'typeorm';
import { GameRoom } from './GameRoom.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(GameRoom)
export class GameRoomRepository extends Repository<GameRoom> {
  async createGame(): Promise<GameRoom> {
    const game = this.create({ gameMode: 'hi' });

    console.log(game);
    const gameList = await this.find();
    console.log(gameList);

    const saveGame = await this.save(game);
    console.log(saveGame);
    return game;
  }
}
