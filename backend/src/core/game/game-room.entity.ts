import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../Base.entity';
import { User } from '../user/user.entity';
import { GameMode } from '../../enum/game-mode.enum';

@Entity()
export class GameRoom extends Base {
  @Column({
    type: 'varchar',
    length: 50,
    comment: '게임 모드',
    default: GameMode.NORMAL,
  })
  gameMode: GameMode;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startAt: Date;

  @Column({
    type: 'timestamp',
    default: null,
  })
  endAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'left_user_id' })
  leftUserId: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'right_user_id' })
  rightUserId: User;
}
