import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../Base.entity';
import { User } from '../user/user.entity';

@Entity()
export class Block extends Base {
	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	blockAt: Date;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'user_id' })
	userId: User;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'blocked_user_id' })
	blockedUserId: User;
}
