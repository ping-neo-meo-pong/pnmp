import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../Base.entity';
import { DmRoom } from './dm-room.entity';
import { User } from '../user/user.entity';

@Entity()
export class Dm extends Base {
	@Column({
		type: 'text',
		comment: '메세지',
	})
	message: string;

	@ManyToOne(() => DmRoom, (dmRoom) => dmRoom.id)
	@JoinColumn({ name: 'dm_room_id' })
	dmRoomId: DmRoom;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'send_user_id' })
	sendUserId: User;
}
