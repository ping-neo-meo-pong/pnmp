import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';
import { CreateRoleDto } from './dto/create-role.dto';

@CustomRepository(Role)
export class RoleRepository extends Repository<Role> {
  async createRole(roleData: CreateRoleDto): Promise<Role> {
    const role = this.create(roleData);

    await this.save(role);
    return role;
  }

  async getRoles(): Promise<Role[]> {
    return this.find();
  }
}
