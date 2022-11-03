import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../Base.entity';
import { Channel } from './Channel.entity';
import { Role } from '../role/Role.entity';
import { User } from '../user/User.entity';

@Entity('ChannelMember')
export class ChannelMember extends Base {
  @Column({
    type: 'datetime',
  })
  MuteEndTime: Date;

  @Column({
    type: 'datetime',
  })
  BanEndTime: Date;

  @Column({
    type: 'datetime',
    default: () => 'NOW()',
  })
  JoinTime: Date;

  @Column({
    type: 'datetime',
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
