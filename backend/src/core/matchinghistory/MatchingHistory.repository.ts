import { EntityRepository, Repository } from "typeorm";
import { MatchingHistory } from "./MathcingHistory.entity";

@EntityRepository(MatchingHistory)
export class MathcingHistoryRepository extends Repository<MatchingHistory> {

}