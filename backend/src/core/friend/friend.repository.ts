import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(Friend)
export class FriendRespository extends Repository<Friend> {}
