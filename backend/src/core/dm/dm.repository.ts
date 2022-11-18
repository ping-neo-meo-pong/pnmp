import { Repository } from 'typeorm';
import { Dm } from './dm.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { CreateDmDto } from './dto/create-dm.dto';

@CustomRepository(Dm)
export class DmRepository extends Repository<Dm> {}
