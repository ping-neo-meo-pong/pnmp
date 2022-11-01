import { Column, Entity } from "typeorm";
import { Base } from "./Base.entity";

@Entity('Channel')
export class Channel extends Base{
	@Column({ type: 'varchar', length: 50, comment: '채널 이름' })
	channelName: string;

	@Column({ type: 'varchar', length: 50, comment: '채널 비번' })
	channelPw : string;

	@Column()
	DeletedAt: Date;

	@Column({ type: 'varchar', length: 50, comment: '채널 설명' })
	description: string;

	@Column({ type: 'boolean', comment: '공개 비공개 설정 여부' })
	isPublic: boolean;

	

}