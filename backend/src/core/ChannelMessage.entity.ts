import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./Base.entity";
import { Channel } from "./Channel.entity";

@Entity('ChannelMessage')
export class ChannelMessage extends Base {
	@Column()
	message: string;

	@ManyToOne(
		() => Channel,
		(channel) => channel.id,
	)
	@JoinColumn({ name: 'channel_id' })
	channelId: Channel;
}