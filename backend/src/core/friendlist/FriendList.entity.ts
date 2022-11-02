import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./Base.entity";
import { User } from "./User.entity";

@Entity('FriendList')
export class FriendList extends Base {
	@Column({
		type: 'datetime',
		default: () => 'NOW()'
	})
	requestTime : Date;

	@Column({
		type: 'datetime'
	})
	acceptTime : Date;

	@Column({
		default: false
	})
	crossFriend: boolean;

	@ManyToOne(
		() => User,
		(user) => user.id,
	)
	@JoinColumn({ name: 'user_id' })
	userId: User;

	@ManyToOne(
		() => User,
		(user) => user.id,
	)
	@JoinColumn({ name: 'user_friend_id' })
	userFriendId: User;
}