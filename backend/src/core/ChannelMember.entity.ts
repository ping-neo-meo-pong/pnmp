import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./Base.entity";
import { Channel } from "./Channel.entity";
import { Role } from "./Role.entity";
import { User } from "./User.entity";

@Entity('ChannelMember')
export class ChannelMember extends Base {
	@Column()
	MuteEndTime: Date;

	@Column()
	BanEndTime: Date;

	@Column()
	JoinTime: Date;

	@Column()
	LeftTime: Date;

	@ManyToOne(
		() => User,
		(user) => user.id,
	)
	@JoinColumn({ name: 'user_id' })
	userId: User;

	@ManyToOne(
		() => Channel,
		(channel) => channel.id
	)
	@JoinColumn({name : 'channel_id'})
	channelId: Channel;

	@ManyToOne(
		() => Role,
		(role) => role.id,
	)
	@JoinColumn({name: 'role_id'})
	roleId : Role;
}