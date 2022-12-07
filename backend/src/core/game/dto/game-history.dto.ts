import { Side, WinLose } from "../../../enum/win-lose.enum"

export interface History {
    win: WinLose,
    side: Side,
    score: number,
    ladder: number,
    userId: string, // uuid
    gameRoomId: string, // uuid
}
  