import { Repository } from 'typeorm';
import { Dm } from './dm.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(Dm)
export class DmRepository extends Repository<Dm> {}
