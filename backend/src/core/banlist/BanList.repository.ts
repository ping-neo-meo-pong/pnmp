import { EntityRepository, Repository } from 'typeorm';
import { BanList } from './BanList.entity';

@EntityRepository(BanList)
export class BanListRepository extends Repository<BanList> {}
