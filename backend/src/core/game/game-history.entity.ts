import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../Base.entity';
import { GameRoom } from './game-room.entity';
import { User } from '../user/user.entity';
import { WinLose } from '../../enum/win-lose.enum';

@Entity()
export class GameHistory extends Base {
  @Column({
    type: 'varchar',
    length: 50,
    comment: '승리 여부',
  })
  win: WinLose;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '경기한 위치',
  })
  side: string;

  @Column({
    type: 'smallint',
    comment: '점수',
  })
  score: number;

  @Column({
    type: 'smallint',
    comment: '래더 점수(총 점수)',
  })
  ladder: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  leftUserId: User;

  @ManyToOne(() => GameRoom, (gameRoom) => gameRoom.id)
  @JoinColumn({ name: 'game_room_id' })
  gameRoomId: GameRoom;
}
