import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../Base.entity';
import { User } from '../user/user.entity';

@Entity()
export class DmRoom extends Base {
  @Column({
    type: 'timestamp',
    default: null,
  })
  userLeftAt: Date;

  @Column({
    type: 'timestamp',
    default: null,
  })
  invitedUserLeftAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'invited_user_id' })
  invitedUserId: User;
}
