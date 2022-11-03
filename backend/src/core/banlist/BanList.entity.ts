import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../Base.entity';
import { User } from '../user/User.entity';

@Entity('BanList')
export class BanList extends Base {
  @Column({
    type: 'timestamp',
  })
  BlockTime: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'block_user_id' })
  blockUserId: User;
}
