import {
  Controller, Post, Get, Body,
  Request,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { GameService } from './game.service';
import { GameRoom } from '../../core/game/game-room.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { request } from 'http';
import { Any } from 'typeorm';
import { CreateGameRoomDto } from 'src/core/game/dto/create-game-room.dto';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getGames(@Request() request): Promise<GameRoom[]> {
    const userToken = request.user;
    return this.gameService.getGames(userToken);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get("/:roomId")
  // getGameData(@Request() request, @Param('roomId') roomId: string) {
  //   return this.gameService.gameData(roomId);
  // }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post()
  @ApiBody({type: CreateGameRoomDto})
  createGameRoom(
    @Request() request,
    @Body() gameRoomData: any,
  ) : Promise<GameRoom>
  {
    const leftUserId = request.user.id;
    const rightUserId = gameRoomData.invitedUserName;
    return this.gameService.createGameRoom(leftUserId, rightUserId);
  }
}
