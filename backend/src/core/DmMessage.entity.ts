import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./Base.entity";
import { DmRoom } from "./DmRoom.entity";
import { User } from "./User.entity";

@Entity('DmMessage')
export class DmMessage extends Base {

	@Column({ type: 'varchar', comment: '메세지' })
	message: string;

	@ManyToOne(
		() => DmRoom,
		(dmRoom) => dmRoom.id,
	)
	@JoinColumn({ name: 'dmRoom_id' })
	dmRoomId: DmRoom;

	@ManyToOne(
		() => User,
		(user) => user.id,
	)
	@JoinColumn({ name: 'sendUser_id' })
	sendUserId: User;

	@ManyToOne(
		() => User,
		(user) => user.id,
	)
	@JoinColumn({ name: 'receiveUser_id' })
	receiveUserId: User;

}