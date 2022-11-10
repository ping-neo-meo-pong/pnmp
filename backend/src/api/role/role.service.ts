import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../core/role/role.entity';
import { RoleRepository } from '../../core/role/role.repository';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private RoleRepository: RoleRepository,
  ) {}

  createRole(): Promise<Role> {
    return this.RoleRepository.createRole();
  }

  getRoles(): Promise<Role[]> {
    return this.RoleRepository.getRoles();
  }
}
