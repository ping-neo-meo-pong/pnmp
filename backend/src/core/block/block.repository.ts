import { Repository } from 'typeorm';
import { Block } from './block.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { CreateBlockDto } from './dto/create-block.dto';

@CustomRepository(Block)
export class BlockRepository extends Repository<Block> {
  async createBlock(createBlockData: CreateBlockDto) {
    const block = this.create(createBlockData);
    await this.save(block);
    return block;
  }
}
