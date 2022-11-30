import { JwkKeyExportOptions } from "crypto";
import { User } from "src/core/user/user.entity";
import {GameMode} from "../../../enum/game-mode.enum";

export interface GameRoom {
  gameLoop: NodeJS.Timer | null,
  startTimer: NodeJS.Timer | null,
  p1EndTimer: NodeJS.Timer | null,
  p2EndTimer: NodeJS.Timer | null,
  gameRoomDto: GameRoomDto;
}

export interface GameRoomDto {
  id: string,
  leftUser: User,
  rightUser: User,
  startAt: Date,
  endAt: Date,
  gameMode: GameMode,
  gameData: {
    W: number,
    H: number,
    UD_d: number,
    bar_d: number,
    ball: {
      x: number,
      y: number,
      v_x: number,
      v_y: number,
    },
    p1: {
      in: boolean,
      mouse_y: number,
      score: number,
    },
    p2: {
      in: boolean,
      mouse_y: number,
      score: number,
    },
  }
};