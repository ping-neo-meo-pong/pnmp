
// import { GameQue } from "./dto/game-queue.dto";
import { GameRoomRepository } from "./game-room.repository";
import { UserRepository } from "../user/user.repository";
import { GameRoom } from "./dto/game-room.dto";
import { GameMode } from "../../enum/game-mode.enum"
import { Injectable } from "@nestjs/common";

@Injectable()
export class GameQueueRepository {
  private gameQue: any[] = [];
  private queLoop: NodeJS.Timer[] = [];
  private idx: number = 0;
  constructor(
    private gameRoomRepository: GameRoomRepository,
    private userRepository: UserRepository,
  ) { }

  addQue(userId: string, rating: number) {
    this.gameQue[this.idx] = { userId: userId, ladder: rating, wait: 0 };
    console.log(this.gameQue);
  }

  async matchingQue(userId: string, i: number): Promise<GameRoom> {
    return this.checkQue(userId, i);
  }

  getGameQue(): any[] {
    return this.gameQue;
  }

  getQueLoop(idx: number): NodeJS.Timer {
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

  nextIdx(): number {
    return this.idx++;
  }

  async checkQue(myId: string, _wait: number): Promise<GameRoom> {
    let myLadder = -1;
    let myidx = 0;
    for (let i=0; this.gameQue[i]; i++) {
      if (myId == this.gameQue[i].userId) {
        myLadder = this.gameQue[i].ladder;
        myidx = i;
      }
    }
    for (let idx=0; this.gameQue[idx]; idx++) {
      // console.log(`idx: ${idx}`);
      // console.log(this.gameQue[idx]);
      if (myId == this.gameQue[idx].userId || this.gameQue[idx].ladder == -1)
        continue ;
      if (_wait >= Math.abs(myLadder - this.gameQue[idx].ladder) &&
        this.gameQue[idx].wait >= Math.abs(myLadder - this.gameQue[idx].ladder))
      {
        clearInterval(this.getQueLoop(myidx));
        clearInterval(this.getQueLoop(idx));
        let leftUser = await this.userRepository.findOneBy({ id: this.gameQue[myidx].userId });
        let rightUser = await this.userRepository.findOneBy({ id: this.gameQue[idx].userId });
        if (myidx < idx) {
          this.gameQue.splice(idx, 1);
          this.gameQue.splice(myidx, 1);
        } else {
          this.gameQue.splice(myidx, 1);
          this.gameQue.splice(idx, 1);
        }
        let room = this.gameRoomRepository.createGameRoom(leftUser, rightUser, GameMode.NORMAL);
        return room;
      }
    }
    return null;
  }
}
