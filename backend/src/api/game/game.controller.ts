import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { GameRoomDto } from '../../core/game/dto/game-room.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateGameRoomDto } from 'src/api/game/dto/create-game-room.dto';
import { isUUID } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getGames(): Promise<GameRoomDto[]> {
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
    if (!isUUID(leftUserId) || !isUUID(rightUserId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    return this.gameService.createGameRoom(leftUserId, rightUserId);
  }
}
