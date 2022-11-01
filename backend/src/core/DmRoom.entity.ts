import { Column, Entity } from "typeorm";
import { Base } from "./Base.entity";

@Entity('DmRoom')
export class DmRoom extends Base {
	
	@Column()
    user1LeftTime: Date;

	@Column()
    user2LeftTime: Date;
}