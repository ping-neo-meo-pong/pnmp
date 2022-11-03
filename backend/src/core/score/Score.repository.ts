import { EntityRepository, Repository } from 'typeorm';
import { Score } from './Score.entity';

@EntityRepository(Score)
export class ScoreRepository extends Repository<Score> {}
