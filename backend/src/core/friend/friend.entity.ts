import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../Base.entity';
import { User } from '../user/user.entity';

@Entity()
export class Friend extends Base {
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  requestAt: Date;

  @Column({
    type: 'timestamp',
    default: null,
  })
  acceptAt: Date;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'user_friend_id' })
  userFriendId: User;
}
