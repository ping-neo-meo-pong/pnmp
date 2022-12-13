import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../Base.entity';
import { Channel } from './channel.entity';
import { User } from '../user/user.entity';
import { RoleInChannel } from '../../enum/role-in-channel.enum';

@Entity()
export class ChannelMember extends Base {
  @Column({
    type: 'varchar',
    length: 50,
    comment: '유저 역할',
    default: RoleInChannel.NORMAL,
  })
  roleInChannel: RoleInChannel;

  @Column({
    type: 'timestamp',
    default: null,
  })
  muteEndAt: Date;

  @Column({
    type: 'timestamp',
    default: null,
  })
  banEndAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  joinAt: Date;

  @Column({
    type: 'timestamp',
    default: null,
  })
  leftAt: Date;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => Channel, (channel) => channel.id, { eager: true })
  @JoinColumn({ name: 'channel_id' })
  channelId: Channel;
}
