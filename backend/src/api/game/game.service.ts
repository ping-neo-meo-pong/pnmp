import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRoom } from '../../core/game/game-room.entity';
import { GameRoomRepository } from '../../core/game/game-room.repository';
import { GameHistoryRepository } from '../../core/game/game-history.repository';
import { CreateGameRoomDto } from 'src/core/game/dto/create-game-room.dto';
import { IsNull } from 'typeorm';
import { DmRoom } from 'src/core/dm/dm-room.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameRoomRepository)
    private gameRoomRepository: GameRoomRepository,
    @InjectRepository(GameHistoryRepository)
    private gameHistoryRepository: GameHistoryRepository,
  ) {}

  //   createGame() {}

  async getGames(userToken): Promise<GameRoom[]> {
    const gameRooms = await this.gameRoomRepository.getGameRooms(userToken);
    const result = [];
    for (const gameRoom of gameRooms) {
      result.push({
        id: gameRoom.id,
        otherUser:
          gameRoom.leftUserId.id === userToken.id
          ? gameRoom.rightUserId.username
          : gameRoom.leftUserId.username,
      });
    }
    return result;
    // return await this.gameRoomRepository.find({
    //   relations: ['leftUserId', 'rightUserId'],
    //   where: { endAt: IsNull() },
    // });
  }
}
