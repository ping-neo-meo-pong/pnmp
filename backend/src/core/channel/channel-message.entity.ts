import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../Base.entity';
import { Channel } from './channel.entity';
import { User } from '../user/user.entity';

@Entity()
export class ChannelMessage extends Base {
	@Column({
		type: 'text',
		comment: '메세지',
	})
	message: string;

	@ManyToOne(() => Channel, (channel) => channel.id)
	@JoinColumn({ name: 'channel_id' })
	channelId: Channel;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'send_user_id' })
	sendUserId: User;
}
