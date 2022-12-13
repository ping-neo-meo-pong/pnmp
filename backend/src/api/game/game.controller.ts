import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { GameService } from './game.service';
import { GameRoomDto } from '../../core/game/dto/game-room.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { request } from 'http';
import { Any } from 'typeorm';
import { CreateGameRoomDto } from 'src/api/game/dto/create-game-room.dto';
import { GameHistory } from 'src/core/game/game-history.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getGames(@Request() request): Promise<GameRoomDto[]> {
    return this.gameService.getGames();
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get("/:roomId")
  // getGameData(@Request() request, @Param('roomId') roomId: string) {
  //   return this.gameService.gameData(roomId);
  // }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post()
  @ApiBody({ type: CreateGameRoomDto })
  createGameRoom(
    @Request() request,
    @Body() gameRoomData: any,
  ): Promise<GameRoomDto> {
    const leftUserId = request.user.id;
    const rightUserId = gameRoomData.invitedUserId;
    return this.gameService.createGameRoom(leftUserId, rightUserId);
  }

  @Get('/history')
  @ApiOperation({ summary: 'get dm과 같음' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getHistorys(@Request() request): Promise<GameHistory[]> {
    const userId = request.user.id;
    return this.gameService.getHistorys(userId);
  }
}
