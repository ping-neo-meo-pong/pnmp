import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Base } from "./base.entity";
import { GameRoom } from "./GameRoom.entity";
import { User } from "./User.entity";

@Entity('matching_history')
export class MatchingHistory extends Base{
	
	@Column({ 
		type: 'varchar',
		length: 50,
		comment: '역할' 
	})
	role : string;

    @Column({
		type: 'datetime',
		default: () => 'NOW()'
	})
    startTime: Date;

	@Column({
		type: 'datetime'
	})
	finishedTime: Date;

	@OneToOne(() => GameRoom)
	@JoinColumn({ name: 'game_id' })
	gameRoomId: GameRoom;

	@ManyToOne(
		() => User,
		(user) => user.id,
	)
	@JoinColumn({ name: 'user_id' })
	userId1: User;

	@ManyToOne(
		() => User,
		(user) => user.id,
	)
	@JoinColumn({ name: 'user_id' })
	userId2: User;
	

}