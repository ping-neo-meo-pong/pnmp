import { Controller, Post, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { GameRoom } from '../../core/gameroom/GameRoom.entity';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  createGame(): Promise<GameRoom> {
    return this.gameService.createGame();
  }

  //   @Patch()
  //   correctionMatchingHistory() {}
}
