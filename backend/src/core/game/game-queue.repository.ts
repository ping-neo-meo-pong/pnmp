import { GameRoomRepository } from './game-room.repository';
import { UserRepository } from '../user/user.repository';
import { Game } from './dto/game-room.dto';
import { GameMode } from '../../enum/game-mode.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameQueueRepository {
  private gameQue: any[] = [];
  private queLoop: NodeJS.Timer[] = [];
  private idx: number = this.gameQue.length;
  constructor(
    private gameRoomRepository: GameRoomRepository,
    private userRepository: UserRepository,
  ) {}

  addQue(userId: string, rating: number, _mode: GameMode) {
    this.gameQue[this.idx] = {
      userId: userId,
      ladder: rating,
      mode: _mode,
      wait: 0,
    };
    this.idx = this.gameQue.length;
    console.log(this.gameQue);
  }

  cencelQue(userId: string): boolean {
    for (let i = 0; this.gameQue[i]; i++) {
      if (userId === this.gameQue[i].userId) {
        clearTimeout(this.getQueLoop(i));
        this.gameQue.splice(i, 1);
        this.idx = this.gameQue.length;
        console.log(this.gameQue);
        return true;
      }
    }
    return false;
  }

  getGameQue(): any[] {
    return this.gameQue;
  }

  getQueLoop(idx: number): NodeJS.Timeout {
    return this.queLoop[idx];
  }

  setQueLoop(idx: number, interval: NodeJS.Timeout) {
    this.queLoop[idx] = interval;
  }

  setWait(idx: number, _wait: number) {
    this.gameQue[idx].wait = _wait;
  }
  getWait(idx: number): number {
    return this.gameQue[idx].wait;
  }

  getIdx(): number {
    return this.idx;
  }

  setIdx(i: number) {
    this.idx = i;
  }

  findIdxByUserId(userId: string): number {
    for (let i = 0; this.gameQue[i]; i++) {
      if (userId === this.gameQue[i].userId) {
        return i;
      }
    }
    console.log(`Q.R: can not find idx by userId`);
    return -1;
  }

  async checkQue(myId: string, _wait: number): Promise<Game> {
    let myLevel = -1;
    let myidx = 0;
    for (let i = 0; this.gameQue[i]; i++) {
      if (myId === this.gameQue[i].userId) {
        myLevel = this.gameQue[i].ladder / 10;
        myidx = i;
      }
    }
    for (let idx = 0; this.gameQue[idx]; idx++) {
      if (myId === this.gameQue[idx].userId || this.gameQue[idx].ladder === -1)
        continue;
      if (
        this.gameQue[myidx].mode === this.gameQue[idx].mode &&
        _wait > Math.abs(myLevel - this.gameQue[idx].ladder / 10) - 1 &&
        this.gameQue[idx].wait >
          Math.abs(myLevel - this.gameQue[idx].ladder / 10) - 1
      ) {
        // Matching!!
        console.log(`me:${myLevel} vs ${this.gameQue[idx].ladder / 10}`);
        clearTimeout(this.getQueLoop(myidx));
        clearTimeout(this.getQueLoop(idx));
        const leftUser = await this.userRepository.findOneBy({
          id: this.gameQue[myidx].userId,
        });
        const rightUser = await this.userRepository.findOneBy({
          id: this.gameQue[idx].userId,
        });
        const room = this.gameRoomRepository.createGame(
          leftUser,
          rightUser,
          this.gameQue[myidx].mode,
        );
        if (myidx < idx) {
          this.gameQue.splice(idx, 1);
          this.gameQue.splice(myidx, 1);
        } else {
          this.gameQue.splice(myidx, 1);
          this.gameQue.splice(idx, 1);
        }
        this.idx = this.gameQue.length;
        return room;
      }
    }
    return null;
  }
}
