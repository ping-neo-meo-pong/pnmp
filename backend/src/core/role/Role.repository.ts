import { EntityRepository, Repository } from "typeorm";
import { Role } from "./Role.entity";

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
	
}