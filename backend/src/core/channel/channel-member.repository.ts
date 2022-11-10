import { Repository } from 'typeorm';
import { ChannelMember } from './channel-member.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(ChannelMember)
export class ChannelMemberRepository extends Repository<ChannelMember> {}
