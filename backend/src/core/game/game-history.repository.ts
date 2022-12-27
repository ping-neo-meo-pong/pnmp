import { Repository, In, Not } from 'typeorm';
import { GameHistory } from './game-history.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { History } from './dto/game-history.dto';
import { WinLose } from '../../enum/win-lose.enum';

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

  async findGameHistorys(userId: string): Promise<GameHistory[]> {
    return await this.find({
      relations: ['userId', 'gameRoomId'],
      where: { userId: { id: userId } },
    });
  }

  async findWonGameHistorys(userId: string): Promise<GameHistory[]> {
    return await this.find({
      relations: ['userId', 'gameRoomId'],
      where: { userId: { id: userId }, win: WinLose.WIN },
    });
  }

  async findGameHistorysOfOther(
    userId: string,
    gameRooms: string[],
  ): Promise<GameHistory[]> {
    return await this.find({
      relations: ['userId', 'gameRoomId'],
      where: {
        gameRoomId: { id: In(gameRooms) },
        userId: { id: Not(userId) },
      },
    });
  }
}
