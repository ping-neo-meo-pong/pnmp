import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRoom } from '../../core/game/game-room.entity';
import { GameRoomRepository } from '../../core/game/game-room.repository';
import { GameHistoryRepository } from '../../core/game/game-history.repository';
import { IsNull } from 'typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameRoomRepository)
    private gameRoomRepository: GameRoomRepository,
    @InjectRepository(GameHistoryRepository)
    private gameHistoryRepository: GameHistoryRepository,
  ) {}

  //   createGame() {}

  async getGames(): Promise<GameRoom[]> {
    return await this.gameRoomRepository.find({
      relations: ['leftUserId', 'rightUserId'],
      where: { endAt: IsNull() },
    });
  }
}
