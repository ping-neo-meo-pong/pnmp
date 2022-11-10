import { Repository } from 'typeorm';
import { ChannelMessage } from './channel-message.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(ChannelMessage)
export class ChannelMessageRepository extends Repository<ChannelMessage> {}
