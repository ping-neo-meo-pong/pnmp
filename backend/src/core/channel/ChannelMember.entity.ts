import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../Base.entity';
import { Channel } from './Channel.entity';
import { Role } from '../role/Role.entity';
import { User } from '../user/User.entity';

@Entity('ChannelMember')
export class ChannelMember extends Base {
  @Column({
    type: 'timestamp',
  })
  MuteEndTime: Date;

  @Column({
    type: 'timestamp',
  })
  BanEndTime: Date;

  @Column({
    type: 'timestamp',
    default: () => 'NOW()',
  })
  JoinTime: Date;

  @Column({
    type: 'timestamp',
  })
  LeftTime: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => Channel, (channel) => channel.id)
  @JoinColumn({ name: 'channel_id' })
  channelId: Channel;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  roleId: Role;
}
