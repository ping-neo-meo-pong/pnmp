import { EntityRepository, Repository } from "typeorm";
import { Channel } from "./Channel.entity";

@EntityRepository(Channel)
export class ChannelRepository extends Repository<Channel> {
	
}