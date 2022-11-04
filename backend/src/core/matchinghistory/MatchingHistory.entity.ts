import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Base } from '../Base.entity';
import { GameRoom } from '../gameroom/GameRoom.entity';
import { User } from '../user/User.entity';

@Entity('MatchingHistory')
export class MatchingHistory extends Base {
  @Column({
    type: 'varchar',
    length: 50,
    comment: '역할',
  })
  role: string;

  @Column({
    type: 'timestamp',
    default: () => 'NOW()',
  })
  startTime: Date;

  @Column({
    type: 'timestamp',
  })
  finishedTime: Date;

  @OneToOne(() => GameRoom)
  @JoinColumn({ name: 'game_room_id' })
  gameRoomId: GameRoom;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  userId1: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  userId2: User;
}
