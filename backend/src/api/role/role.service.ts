import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../core/role/role.entity';
import { RoleRepository } from '../../core/role/role.repository';
import { CreateRoleDto } from '../../core/role/dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
  ) {}

  createRole(roleData: CreateRoleDto): Promise<Role> {
    return this.roleRepository.createRole(roleData);
  }

  getRoles(): Promise<Role[]> {
    return this.roleRepository.getRoles();
  }
}
