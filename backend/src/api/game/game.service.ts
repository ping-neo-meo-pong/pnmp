import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRoomDto } from '../../core/game/dto/game-room.dto';
import { GameRoomRepository } from '../../core/game/game-room.repository';
import { GameHistoryRepository } from '../../core/game/game-history.repository';
import { UserRepository } from 'src/core/user/user.repository';
import { GameMode } from 'src/enum/game-mode.enum';
import { GameQueueRepository } from 'src/core/game/game-queue.repository';
import { GameHistory } from 'src/core/game/game-history.entity';
import { GameRoomInfoDto } from 'src/api/game/dto/game-room-info.dto';
import { User } from '../../core/user/user.entity';
import { UserInfoDto } from '../user/dto/user-info.dto';

@Injectable()
export class GameService {
  constructor(
    private gameRoomRepository: GameRoomRepository,
    @InjectRepository(GameHistoryRepository)
    private gameHistoryRepository: GameHistoryRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private gameQueueRepository: GameQueueRepository,
  ) {}

  changeUserInfo(oldInfo: User) {
    const newInfo: UserInfoDto = new UserInfoDto();
    newInfo.id = oldInfo.id;
    newInfo.username = oldInfo.username;
    newInfo.profileImage = oldInfo.profileImage;
    newInfo.status = oldInfo.status;
    newInfo.ladder = oldInfo.ladder;
    return newInfo;
  }

  changeGameInfo(oldInfo: GameRoomDto): GameRoomInfoDto {
    const newInfo: GameRoomInfoDto = new GameRoomInfoDto();
    newInfo.id = oldInfo.id;
    newInfo.leftUser = this.changeUserInfo(oldInfo.leftUser);
    newInfo.rightUser = this.changeUserInfo(oldInfo.rightUser);
    newInfo.gameMode = oldInfo.gameMode;
    newInfo.startAt = oldInfo.startAt;
    console.log(newInfo);
    return newInfo;
  }

  async getGames() {
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
      if (gameRooms[i]) ttt.push(this.changeGameInfo(gameRooms[i].gameRoomDto));
    }
    return ttt;
  }

  async getHistorys(userId: string): Promise<GameHistory[]> {
    const Historys = await this.gameHistoryRepository.getHistorys(userId);
    const result = [];
    console.log('history');
    for (const history of Historys) {
      console.log(history);
      result.push(history);
    }
    return result;
  }

  async createGameRoom(
    userId: string,
    invitedUserId: string,
  ): Promise<GameRoomDto> {
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
