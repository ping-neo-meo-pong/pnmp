import { EntityRepository, Repository } from 'typeorm';
import { ChannelMember } from './ChannelMember.entity';

@EntityRepository(ChannelMember)
export class ChannelMemberRepository extends Repository<ChannelMember> {}
