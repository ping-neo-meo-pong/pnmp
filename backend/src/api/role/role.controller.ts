import { Controller, Post, Get, Body } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from '../../core/role/role.entity';
import { CreateRoleDto } from '../../core/role/dto/create-role.dto';

@Controller('test')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  getRoles(): Promise<Role[]> {
    return this.roleService.getRoles();
  }

  @Post()
  createRole(@Body() roleData: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(roleData);
  }
}
