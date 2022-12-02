import { GameRoom } from './dto/game-room.dto';
import { GameMode } from 'src/enum/game-mode.enum';
import { CreateGameRoomDto } from '../../api/game/dto/create-game-room.dto';
import { User } from '../user/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameRoomRepository {
  private gameRooms: GameRoom[] = [];
  private nextRoomId: number = 0;

  async createGameRoom(leftUser: User, rightUser: User, gameMode: GameMode): Promise<GameRoom> {
    this.gameRooms[this.nextRoomId] = initRoom(leftUser, rightUser, gameMode, this.nextRoomId.toString());
    return this.gameRooms[this.nextRoomId++];
  }

  async findById(roomId: number): Promise<GameRoom> {
    return this.gameRooms[roomId];
  }

  async findByUserId(userId: string): Promise<GameRoom | null>{
    for (const i in this.gameRooms) {
      if (this.gameRooms[i].gameRoomDto.leftUser.id == userId)
        return this.gameRooms[i];
      else if (this.gameRooms[i].gameRoomDto.rightUser.id == userId)
        return this.gameRooms[i];
    }
    return null;
  }

  async findAll(): Promise<GameRoom []> {
    return this.gameRooms;
  }


  // async getGameRooms(userToken): Promise<GameRoom[]> {
  //   const gameRooms = await this.find({
  //     relations: ['leftUserId', 'rightUserId'],
  //   });
  //   return gameRooms;
  // }

  // async getGameRoomOne(userId): Promise<GameRoom> {
  //   console.log(userId);
  //   const gameRoom_left = await this.findOneBy({
  //     leftUserId: { id: userId },
  //   });
  //   if (gameRoom_left) return gameRoom_left;

  //   const gameRoom_right = await this.findOneBy({
  //     rightUserId: { id: userId },
  //   });
  //   return gameRoom_right;
  // }
}


function initRoom(leftUser: User, rightUser: User, mode: GameMode, roomId: string) {
  let _W = 500;
  let _H = 400;
  let ball_v_x = 5;
  let ball_v_y = 6;
  let plus_speed = 1;
  if (mode == GameMode.HARD)
    ball_v_x = 9;
  if (mode == GameMode.HARD)
    ball_v_y = 11;
  if (mode == GameMode.HARD)
    plus_speed = 2;

  return {
    gameLoop: null,
    startTimer: null,
    p1EndTimer: null,
    p2EndTimer: null,
    gameRoomDto: {
      id: roomId,
      leftUser: leftUser,
      rightUser: rightUser,
      startAt: new Date(),
      endAt: new Date(),
      gameMode: mode,
      gameData: {
        W: _W,
        H: _H,
        UD_d: 20,
        bar_d: 50,
        loop: null,
        ball: {
          x: _W / 2,
          y: _H / 2,
          v_x: 6,
          v_y: 7,
          plus_speed: plus_speed,
        },
        p1: {
          in: false,
          loop: null,
          mouse_y: 0,
          score: 0,
        },
        p2: {
          in: false,
          loop: null,
          mouse_y: 0,
          score: 0,
        },
      }
    }
  };
}