import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Base } from "./Base.entity";
import { Role } from "./Role.entity";
import { User } from "./User.entity";

@Entity('score')
export class Score extends Base{
	@Column({ type: 'varchar', length: 50, comment: '승리 여부' })
	win : string

	@Column({ type: 'tinyint', comment: '점수' })
	score : number

	@Column({ type: 'tinyint', comment: '래더 점수(총 점수)'})
	LadderScore : number

	@ManyToOne(
		() => User,
		(user) => user.id,
	)
	@JoinColumn({ name: 'user_id' })
	userId: User[];

	@OneToOne(() => Role)
	@JoinColumn({ name: 'role_id' })
	roleId: Role;

	@OneToOne(() => MatchingHistory)
	@JoinColumn({name: 'matching_id'})
	matchingHistoryId: MatchingHistory;
}