import { EntityRepository, Repository } from 'typeorm';
import { DmMessage } from './DmMessage.entity';

@EntityRepository(DmMessage)
export class DmMessageRepository extends Repository<DmMessage> {}
