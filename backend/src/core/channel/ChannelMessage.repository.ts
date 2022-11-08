import { EntityRepository, Repository } from 'typeorm';
import { ChannelMessage } from './ChannelMessage.entity';

@EntityRepository(ChannelMessage)
export class ChannelMessageRepository extends Repository<ChannelMessage> {}
