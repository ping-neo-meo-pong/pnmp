import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRoomDto } from '../../core/game/dto/game-room.dto';
import { GameRoomRepository } from '../../core/game/game-room.repository';
import { GameHistoryRepository } from '../../core/game/game-history.repository';
import { CreateGameRoomDto } from 'src/api/game/dto/create-game-room.dto';
import { IsNull } from 'typeorm';
import { DmRoom } from 'src/core/dm/dm-room.entity';
import { UserRepository } from 'src/core/user/user.repository';
import { SocketRepository } from 'src/core/socket/socket.repository';
import { GameMode } from 'src/enum/game-mode.enum';
import { GameQueueRepository } from 'src/core/game/game-queue.repository';

@Injectable()
export class GameService {
  constructor(
    private gameRoomRepository: GameRoomRepository,
    @InjectRepository(GameHistoryRepository)
    private gameHistoryRepository: GameHistoryRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private socketRepository: SocketRepository,
    private gameQueueRepository: GameQueueRepository,
  ) {}

  //   createGame() {}

  async getGames(): Promise<GameRoomDto[]> {
    const gameRooms = await this.gameRoomRepository.findAll();
    console.log('getGames');
    console.log(gameRooms);
    if (!gameRooms) {
      console.log(`cant get games`);
      return null;
    }
    const ttt = [];
    for (const i in gameRooms) {
      console.count(`hi`);
      if (gameRooms[i]) ttt.push(gameRooms[i].gameRoomDto);
    }
    return ttt;
  }

  async createGameRoom(userId: string, invitedUserId: string) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    const invitedUser = await this.userRepository.findOneBy({
      id: invitedUserId,
    });
    return (
      await this.gameRoomRepository.createGame(
        user,
        invitedUser,
        GameMode.NORMAL,
      )
    ).gameRoomDto;
  }

  async addQue(userId: string, rating: number, mode: GameMode) {
    this.gameQueueRepository.addQue(userId, rating, mode);
  }
}
