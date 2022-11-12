import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../Base.entity';
import { Channel } from './channel.entity';
import { User } from '../user/user.entity';

@Entity()
export class ChannelMember extends Base {
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
	})
	joinAt: Date;

	@Column({
		type: 'timestamp',
		default: null,
	})
	leftAt: Date;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'user_id' })
	userId: User;

	@ManyToOne(() => Channel, (channel) => channel.id)
	@JoinColumn({ name: 'channel_id' })
	channelId: Channel;
}
