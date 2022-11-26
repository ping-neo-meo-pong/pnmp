import { Repository } from 'typeorm';
import { GameHistory } from './game-history.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(GameHistory)
export class GameHistoryRepository extends Repository<GameHistory> {}
