import { Game } from './dto/game-room.dto';
import { GameMode } from 'src/enum/game-mode.enum';
import { CreateGameRoomDto } from '../../api/game/dto/create-game-room.dto';
import { User } from '../user/user.entity';
import { Injectable } from '@nestjs/common';
import { GameRoom } from './game-room.entity';
import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex.decorator';

@Injectable()
@CustomRepository(GameRoom)
export class GameRoomRepository extends Repository<GameRoom> {
  private gameRooms: any = {};

  async createGameRoom(gameRoomData: CreateGameRoomDto): Promise<GameRoom> {
    const gameRoom = this.create(gameRoomData);
    await this.save(gameRoom);
    return gameRoom;
  }

  async getGameRooms(): Promise<GameRoom[]> {
    const gameRoom = await this.find({
      relations: ['leftUserId', 'rightUserId'],
    });
    return gameRoom;
  }

  async getGameRoomOne(userId): Promise<GameRoom> {
    console.log(userId);
    const gameRoom_left = await this.findOneBy({
      leftUserId: { id: userId },
    });
    if (gameRoom_left) return gameRoom_left;

    const gameRoom_right = await this.findOneBy({
      rightUserId: { id: userId },
    });
    return gameRoom_right;
  }

  async createGame(
    leftUser: User,
    rightUser: User,
    gameMode: GameMode,
  ): Promise<Game> {
    const gameRoom = await this.createGameRoom({
      leftUserId: leftUser,
      rightUserId: rightUser,
      gameMode: gameMode,
    });
    this.gameRooms[gameRoom.id] = initRoom(gameRoom);
    return this.gameRooms[gameRoom.id];
  }

  async eraseGameRoom(roomId: string) {
    await this.update(roomId, {
      endAt: () => 'CURRENT_TIMESTAMP',
    });
    delete this.gameRooms[roomId];
    console.log(this.gameRooms);
  }

  async findById(roomId: string): Promise<Game> {
    return this.gameRooms[roomId];
  }

  async findByUserId(userId: string): Promise<Game> {
    for (const i in this.gameRooms) {
      if (this.gameRooms[i].gameRoomDto.leftUser.id == userId)
        return this.gameRooms[i];
      else if (this.gameRooms[i].gameRoomDto.rightUser.id == userId)
        return this.gameRooms[i];
    }
    return;
  }

  async findAll(): Promise<Game[]> {
    return this.gameRooms;
  }
}

function initRoom(gameRoom: GameRoom) {
  const _W = 500;
  const _H = 400;
  let ball_v_x = 3;
  let ball_v_y = 4;
  let plus_speed = 1;
  if (gameRoom.gameMode == GameMode.HARD) ball_v_x = 6;
  if (gameRoom.gameMode == GameMode.HARD) ball_v_y = 7;
  if (gameRoom.gameMode == GameMode.HARD) plus_speed = 2;

  return {
    gameLoop: null,
    startTimer: null,
    p1EndTimer: null,
    p2EndTimer: null,
    gameRoomDto: {
      id: gameRoom.id,
      leftUser: gameRoom.leftUserId,
      rightUser: gameRoom.rightUserId,
      startAt: gameRoom.startAt,
      endAt: gameRoom.endAt,
      gameMode: gameRoom.gameMode,
      gameData: {
        W: _W,
        H: _H,
        UD_d: 20,
        bar_d: 50,
        loop: null,
        ball: {
          x: _W / 2,
          y: _H / 2,
          v_x: ball_v_x,
          v_y: ball_v_y,
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
      },
    },
  };
}
