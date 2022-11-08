import { EntityRepository, Repository } from 'typeorm';
import { FriendList } from './FriendList.entity';

@EntityRepository(FriendList)
export class FriendListRespository extends Repository<FriendList> {}
