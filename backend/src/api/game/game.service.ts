import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRoom } from '../../core/gameroom/GameRoom.entity';
import { GameRoomRepository } from '../../core/gameroom/GameRoom.repository';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameRoomRepository)
    private gameRoomRepository: GameRoomRepository,
  ) {}
  createGame(): Promise<GameRoom> {
    return this.gameRoomRepository.createGame();
  }
}
