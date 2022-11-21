import { Controller, Post, Get, Body,
  Request,
  UseGuards,
  Query, } from '@nestjs/common';
import { GameService } from './game.service';
import { GameRoom } from '../../core/game/game-room.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getGames(@Request() request): Promise<GameRoom[]> {
    const userToken = request.user;
    return this.gameService.getGames(userToken);
  }

  //   @Post()
  //   createGame() {}
}
