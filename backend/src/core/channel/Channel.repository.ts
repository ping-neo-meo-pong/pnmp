import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(Channel)
export class ChannelRepository extends Repository<Channel> {}
