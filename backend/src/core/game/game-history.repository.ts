import { Repository } from 'typeorm';
import { GameHistory } from './game-history.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { History } from './dto/game-history.dto';

@CustomRepository(GameHistory)
export class GameHistoryRepository extends Repository<GameHistory> {
  async createHistory(history: History): Promise<History> {
    return await this.save({
      win: history.win,
      side: history.side,
      score: history.score,
      ladder: history.ladder,
      userId: history.userId,
      gameRoomId: history.gameRoomId,
    } as any);
  }
  async getHistorys(userId: string): Promise<GameHistory[]> {
    const Historys = await this.find({
      relations: ['userId'],
      where: [{ userId: { id: userId } }],
    });
    return Historys;
  }
  // async uploadHistory(history: GameHistory) : Promise<History> {
  //     return await this.update(history);
  // }
}
