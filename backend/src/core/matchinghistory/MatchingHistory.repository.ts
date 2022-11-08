import { EntityRepository, Repository } from 'typeorm';
import { MatchingHistory } from './MatchingHistory.entity';

@EntityRepository(MatchingHistory)
export class MathcingHistoryRepository extends Repository<MatchingHistory> {}
