import { Controller, Get, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { GameRoomDto } from '../../core/game/dto/game-room.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getGames(): Promise<GameRoomDto[]> {
    return this.gameService.getGames();
  }

  //   @Post()
  //   @ApiBody({ type: CreateGameRoomDto })
  //   @ApiBearerAuth()
  //   @UseGuards(AuthGuard('jwt'))
  //   createGameRoom(
  //     @Request() request,
  //     @Body() gameRoomData,
  //   ): Promise<GameRoomDto> {
  //     const leftUserId = request.user.id;
  //     const rightUserId = gameRoomData.invitedUserId;
  //     if (!isUUID(leftUserId) || !isUUID(rightUserId)) {
  //       throw new BadRequestException('id가 uuid가 아님');
  //     }
  //     return this.gameService.createGameRoom(leftUserId, rightUserId);
  //   }

  //   @Get('/history')
  //   @ApiOperation({ summary: 'get dm과 같음' })
  //   @ApiBearerAuth()
  //   @UseGuards(AuthGuard('jwt'))
  //   getHistorys(@Request() request): Promise<GameHistory[]> {
  //     const userId = request.user.id;
  //     return this.gameService.getHistorys(userId);
  //   }
}
