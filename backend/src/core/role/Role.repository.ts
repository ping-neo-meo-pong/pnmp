import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CustomRepository } from '../../typeorm-ex.decorator';

@CustomRepository(Role)
export class RoleRepository extends Repository<Role> {
  async createRole(): Promise<Role> {
    const Role = this.create({ role: 'hi' });

    await this.save(Role);
    return Role;
  }

  async getRoles(): Promise<Role[]> {
    return this.find();
  }
}
