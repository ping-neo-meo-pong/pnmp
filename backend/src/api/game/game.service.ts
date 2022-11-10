import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRoom } from '../../core/game/game-room.entity';
import { GameRoomRepository } from '../../core/game/game-room.repository';
import { GameHistoryRepository } from '../../core/game/game-history.repository';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameRoomRepository)
    private gameRepository: GameRoomRepository,
    @InjectRepository(GameHistoryRepository)
    private gameHistoryRepository: GameHistoryRepository,
  ) {}

  createGame() {}

  getGames() {}
}
