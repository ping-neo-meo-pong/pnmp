import { Controller, Post, Get } from '@nestjs/common';
import { GameService } from './game.service';
import { GameRoom } from '../../core/game/game-room.entity';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  getGames(): Promise<GameRoom[]> {
    return this.gameService.getGames();
  }

  //   @Post()
  //   createGame() {}
}
