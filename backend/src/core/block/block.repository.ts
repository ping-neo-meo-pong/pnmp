import { Repository } from 'typeorm';
import { Block } from './block.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(Block)
export class BlockRepository extends Repository<Block> {}
